import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsService } from './ws.service';
import { DmxViewerComponent } from './shared/dmx-viewer/dmx-viewer.component';
import { WsStatusComponent } from './shared/ws-status/ws-status.component';
import { TuiRoot } from '@taiga-ui/core';
import { ApiService } from './api.service';
import { PlanSelectorComponent } from './shared/plan-selector/plan-selector.component';
import { PlansResponse } from './data/plans.model';
import { ControlConfig } from './data/config.model';
import { SoundLibrary } from './data/sound-library.model';

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

  constructor() {
    this.loadConfig();
    this.loadPlans();
    this.loadSoundLibrary();
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
        this.loadSoundLibrary();
      },
      error: (error) => console.error('Failed to update config', error),
    });
  }

  private loadPlans(): void {
    this.api.getPlans().subscribe({
      next: (plans) => this.plansResponse.set(plans),
      error: (error) => console.error('Failed to load plans', error),
    });
  }

  private loadConfig(): void {
    this.api.getConfig().subscribe({
      next: (cfg) => this.config.set(cfg),
      error: (error) => console.error('Failed to load config', error),
    });
  }

  private loadSoundLibrary(): void {
    this.api.getSoundLibrary().subscribe({
      next: (library) => this.soundLibrary.set(library),
      error: (error) => console.error('Failed to load sound library', error),
    });
  }
}
