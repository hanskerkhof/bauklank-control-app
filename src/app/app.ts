import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsStatusComponent } from './shared/ws-status/ws-status.component';
import { TuiRoot } from '@taiga-ui/core';
import { PlanSelectorComponent } from './shared/plan-selector/plan-selector.component';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { ControlStateService } from './services/control-state.service';
import { SoundLibrarySummaryComponent } from './shared/sound-library-summary/sound-library-summary.component';
import { ArtnetConfigComponent } from './shared/artnet-config/artnet-config.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TuiRoot,
    WsStatusComponent,
    PlanSelectorComponent,
    RouterOutlet,
    NavigationBarComponent,
    SoundLibrarySummaryComponent,
    ArtnetConfigComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-shell',
  },
})
export class App {
  protected readonly state = inject(ControlStateService);

  protected handleSetPlan(planId: string): void {
    this.state.setPlan(planId);
  }

  protected handleRestart(): void {
    this.state.restart();
  }
}
