import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan } from '../../data/plans.model';

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
  readonly activePlanId = input<string | null>(null);
  readonly setPlan = output<string>();

  protected readonly selectedPlanId = signal<string | null>(null);

  protected readonly canSubmit = computed(() => {
    const selected = this.selectedPlanId();
    const active = this.activePlanId();
    return Boolean(selected && active && selected !== active);
  });

  constructor() {
    effect(() => {
      const list = this.plans();
      const active = this.activePlanId();
      const selected = this.selectedPlanId();

      if (active && (!selected || selected === active)) {
        this.selectedPlanId.set(active);
        return;
      }

      if (!selected && list.length > 0) {
        this.selectedPlanId.set(list[0].id);
      }
    });
  }

  protected onPlanChange(nextPlanId: string): void {
    this.selectedPlanId.set(nextPlanId);
  }

  protected submitPlan(): void {
    const selected = this.selectedPlanId();
    if (selected) {
      this.setPlan.emit(selected);
    }
  }
}
