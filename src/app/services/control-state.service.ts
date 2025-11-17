import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  finalize,
  forkJoin,
  switchMap,
  tap,
  timer,
  throwError,
} from 'rxjs';
import { WsService } from './ws.service';
import { ApiService } from './api.service';
import { PlansResponse, Plan, Fixture } from '../data/plans.model';
import { ControlConfig } from '../data/config.model';
import { SoundLibrary } from '../data/sound-library.model';
import { DmxPayload } from './ws.service';

@Injectable({ providedIn: 'root' })
export class ControlStateService {
  private readonly ws = inject(WsService);
  private readonly api = inject(ApiService);

  private readonly plansResponseSignal = signal<PlansResponse | null>(null);
  private readonly configSignal = signal<ControlConfig | null>(null);
  private readonly soundLibrarySignal = signal<SoundLibrary | null>(null);
  private readonly isRestartingSignal = signal(false);
  private readonly dmxSignal = signal<DmxPayload | null>(null);

  readonly dmx = this.dmxSignal.asReadonly();
  readonly plans = computed(() => this.plansResponseSignal()?.plans ?? []);
  readonly sortedPlans = computed(() =>
    [...this.plans()].sort((a, b) => a.label.localeCompare(b.label)),
  );
  readonly activePlanId = computed(() => this.configSignal()?.plan ?? null);
  readonly activePlanLabel = computed(() => this.findActivePlan()?.label ?? this.activePlanId());
  readonly activePlanFixtures = computed<Fixture[]>(() => this.findActivePlan()?.fixtures ?? []);
  readonly config = computed(() => this.configSignal());
  readonly soundLibrary = computed(() => this.soundLibrarySignal());
  readonly soundLibrarySummary = computed(() => {
    const library = this.soundLibrarySignal();
    if (!library) {
      return null;
    }

    const trackCount = library.tracks?.length ?? 0;
    return `${library.plan} tracks: ${trackCount}`;
  });
  readonly isRestarting = this.isRestartingSignal.asReadonly();

  private readonly dataReloaders: Array<() => Observable<unknown>> = [
    () => this.fetchConfig(),
    () => this.fetchSoundLibrary(),
    () => this.fetchDmx(),
  ];

  constructor() {
    this.fetchPlans().subscribe();
    this.reloadData().subscribe();
    this.ws.connect();

    effect(() => {
      this.dmxSignal.set(this.ws.dmx());
    });
  }

  setPlan(planId: string): void {
    const currentConfig = this.configSignal();
    if (!currentConfig || currentConfig.plan === planId) {
      return;
    }

    this.updateConfig({ plan: planId }).subscribe({
      next: () => {
        this.fetchSoundLibrary().subscribe();
      },
      error: (error) => console.error('Failed to update config', error),
    });
  }

  updateConfig(partialConfig: Partial<ControlConfig>): Observable<ControlConfig> {
    const currentConfig = this.configSignal();

    if (!currentConfig) {
      return throwError(() => new Error('Config not loaded'));
    }

    const nextConfig: ControlConfig = {
      ...currentConfig,
      ...partialConfig,
    };

    return this.api.updateConfig(nextConfig).pipe(
      tap((updated) => this.configSignal.set(updated)),
    );
  }

  restart(): void {
    if (this.isRestartingSignal()) {
      return;
    }

    this.isRestartingSignal.set(true);
    this.api
      .restart()
      .pipe(
        switchMap(() => timer(2000)),
        switchMap(() => this.reloadData()),
        finalize(() => this.isRestartingSignal.set(false)),
      )
      .subscribe({
        error: (error) => console.error('Failed to restart', error),
      });
  }

  private findActivePlan(): Plan | undefined {
    const activeId = this.activePlanId();
    if (!activeId) {
      return undefined;
    }

    return this.plans().find((plan) => plan.id === activeId);
  }

  private fetchPlans(): Observable<PlansResponse> {
    return this.api.getPlans().pipe(
      tap((plans) => this.plansResponseSignal.set(plans)),
      catchError((error) => {
        console.error('Failed to load plans', error);
        return EMPTY;
      }),
    );
  }

  private fetchConfig(): Observable<ControlConfig> {
    return this.api.getConfig().pipe(
      tap((cfg) => this.configSignal.set(cfg)),
      catchError((error) => {
        console.error('Failed to load config', error);
        return EMPTY;
      }),
    );
  }

  private fetchSoundLibrary(): Observable<SoundLibrary> {
    return this.api.getSoundLibrary().pipe(
      tap((library) => this.soundLibrarySignal.set(library)),
      catchError((error) => {
        console.error('Failed to load sound library', error);
        return EMPTY;
      }),
    );
  }

  private fetchDmx(): Observable<DmxPayload> {
    return this.api.getDmx().pipe(
      tap((dmxPayload) => this.dmxSignal.set(dmxPayload)),
      catchError((error) => {
        console.error('Failed to load DMX', error);
        return EMPTY;
      }),
    );
  }

  private reloadData(): Observable<unknown[]> {
    return forkJoin(this.dataReloaders.map((loader) => loader()));
  }
}
