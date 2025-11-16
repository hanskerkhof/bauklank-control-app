import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsService } from './ws.service';
import { DmxViewerComponent } from './dmx-viewer.component';
import { WsStatusComponent } from './ws-status.component';
import { TuiRoot } from '@taiga-ui/core';
import { ApiService } from './api.service';
import { PlanSelectorComponent } from './plan-selector.component';
import { PlansResponse } from './plans.model';

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

  protected readonly dmx = computed(() => this.ws.dmx());
  protected readonly plans = computed(() => this.plansResponse()?.plans ?? []);
  protected readonly activePlanLabel = computed(() => {
    const response = this.plansResponse();
    if (!response) {
      return null;
    }

    const activeId = response.active;
    const activePlan = response.plans.find((plan) => plan.id === activeId);
    return activePlan ? activePlan.label : activeId;
  });

  constructor() {
    this.loadPlans();
    this.ws.connect();
  }

  private loadPlans(): void {
    this.api.getPlans().subscribe({
      next: (plans) => this.plansResponse.set(plans),
      error: (error) => console.error('Failed to load plans', error),
    });
  }
}

// // src/app/app.ts
// import {
//   Component,
//   ChangeDetectionStrategy,
//   computed,
//   inject,
// } from '@angular/core';
// import { WsService } from './ws.service';
// import { DmxViewerComponent } from './dmx-viewer.component';
//
// @Component({
//   selector: 'app-root',
//   imports: [DmxViewerComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   host: {
//     class: 'app-shell',
//   },
// })
// export class App {
//   private readonly ws = inject(WsService);
//
//   protected readonly dmx = computed(() => this.ws.dmx());
//
//   constructor() {
//     this.ws.connect();
//   }
// }
