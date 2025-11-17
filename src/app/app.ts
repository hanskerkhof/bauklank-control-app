import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsService } from './services/ws.service';
import { DmxViewerComponent } from './shared/dmx-viewer/dmx-viewer.component';
import { WsStatusComponent } from './shared/ws-status/ws-status.component';
import { TuiRoot } from '@taiga-ui/core';
import { ApiService } from './services/api.service';
import { PlanSelectorComponent } from './shared/plan-selector/plan-selector.component';
import { PlansResponse } from './data/plans.model';
import { ControlConfig } from './data/config.model';
import { SoundLibrary } from './data/sound-library.model';
import { EMPTY, Observable, catchError, finalize, forkJoin, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TuiRoot, DmxViewerComponent, WsStatusComponent, PlanSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-shell',
  },
})
export class App {
  private readonly ws = inject(WsService);
  private readonly api = inject(ApiService);
  private readonly plansResponse = signal<PlansResponse | null>(null);
  private readonly config = signal<ControlConfig | null>(null);
  private readonly soundLibrary = signal<SoundLibrary | null>(null);
  protected readonly isRestarting = signal(false);

  protected readonly dmx = computed(() => this.ws.dmx());
  protected readonly plans = computed(() => this.plansResponse()?.plans ?? []);
  protected readonly sortedPlans = computed(() =>
    [...this.plans()].sort((a, b) => a.label.localeCompare(b.label)),
  );
  protected readonly activePlanId = computed(() => this.config()?.plan ?? null);
  protected readonly activePlanLabel = computed(() => {
    const activeId = this.activePlanId();
    if (!activeId) {
      return null;
    }

    const activePlan = this.plans().find((plan) => plan.id === activeId);
    return activePlan ? activePlan.label : activeId;
  });
  protected readonly soundLibrarySummary = computed(() => {
    const library = this.soundLibrary();
    if (!library) {
      return null;
    }

    const trackCount = library.tracks?.length ?? 0;
    return `${library.plan} tracks: ${trackCount}`;
  });

  private readonly dataReloaders: Array<() => Observable<unknown>> = [
    () => this.fetchConfig(),
    () => this.fetchSoundLibrary(),
  ];

  constructor() {
    this.fetchPlans().subscribe();
    this.reloadData().subscribe();
    this.ws.connect();
  }

  protected handleSetPlan(planId: string): void {
    const currentConfig = this.config();
    if (!currentConfig || currentConfig.plan === planId) {
      return;
    }

    const nextConfig: ControlConfig = {
      ...currentConfig,
      plan: planId,
    };

    this.api.updateConfig(nextConfig).subscribe({
      next: (updated) => {
        this.config.set(updated);
        this.fetchSoundLibrary().subscribe();
      },
      error: (error) => console.error('Failed to update config', error),
    });
  }

  protected handleRestart(): void {
    if (this.isRestarting()) {
      return;
    }

    this.isRestarting.set(true);
    this.api
      .restart()
      .pipe(
        switchMap(() => timer(2000)),
        switchMap(() => this.reloadData()),
        finalize(() => this.isRestarting.set(false)),
      )
      .subscribe({
        error: (error) => console.error('Failed to restart', error),
      });
  }

  private fetchPlans(): Observable<PlansResponse> {
    return this.api.getPlans().pipe(
      tap((plans) => this.plansResponse.set(plans)),
      catchError((error) => {
        console.error('Failed to load plans', error);
        return EMPTY;
      }),
    );
  }

  private fetchConfig(): Observable<ControlConfig> {
    return this.api.getConfig().pipe(
      tap((cfg) => this.config.set(cfg)),
      catchError((error) => {
        console.error('Failed to load config', error);
        return EMPTY;
      }),
    );
  }

  private fetchSoundLibrary(): Observable<SoundLibrary> {
    return this.api.getSoundLibrary().pipe(
      tap((library) => this.soundLibrary.set(library)),
      catchError((error) => {
        console.error('Failed to load sound library', error);
        return EMPTY;
      }),
    );
  }

  private reloadData(): Observable<unknown[]> {
    return forkJoin(this.dataReloaders.map((loader) => loader()));
  }
}
