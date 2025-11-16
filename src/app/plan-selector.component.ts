import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan } from './plans.model';

@Component({
  selector: 'app-plan-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-selector.component.html',
  styleUrls: ['./plan-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'plan-selector',
  },
})
export class PlanSelectorComponent {
  readonly plans = input<Plan[]>([]);

  protected readonly selectedPlanId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const list = this.plans();
      if (list.length > 0 && !this.selectedPlanId()) {
        this.selectedPlanId.set(list[0].id);
      }
    });
  }

  protected onPlanChange(nextPlanId: string): void {
    this.selectedPlanId.set(nextPlanId);
  }
}
