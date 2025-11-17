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
    return Boolean(selected && selected !== active);
  });

  private lastActivePlanId: string | null = null;

  constructor() {
    effect(() => {
      const list = this.plans();
      const active = this.activePlanId();

      const activeChanged = active !== this.lastActivePlanId;
      if (activeChanged) {
        this.lastActivePlanId = active;

        if (active) {
          this.selectedPlanId.set(active);
          return;
        }
      }

      if (!this.selectedPlanId() && list.length > 0) {
        this.selectedPlanId.set(active ?? list[0].id);
      }
    });
  }

  protected planLabel(plan: Plan): string {
    const fixtureCount = plan.fixtureCount ?? plan.fixtures?.length ?? 0;
    return `${plan.label} - fixtures: ${fixtureCount}`;
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
