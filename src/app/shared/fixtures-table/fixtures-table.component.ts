import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fixture } from '../../data/plans.model';
import { CommandModalComponent } from '../command-modal/command-modal.component';

@Component({
  selector: 'app-fixtures-table',
  standalone: true,
  imports: [CommonModule, CommandModalComponent],
  templateUrl: './fixtures-table.component.html',
  styleUrls: ['./fixtures-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixturesTableComponent {
  readonly fixtures = input<Fixture[]>([]);
  readonly planLabel = input<string | null>(null);

  protected readonly hasFixtures = computed(() => (this.fixtures()?.length ?? 0) > 0);
}
