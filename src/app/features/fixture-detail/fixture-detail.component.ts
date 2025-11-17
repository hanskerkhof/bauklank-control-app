import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlStateService } from '../../services/control-state.service';
import { FixturesTableComponent } from '../../shared/fixtures-table/fixtures-table.component';

@Component({
  selector: 'app-fixture-detail',
  standalone: true,
  imports: [CommonModule, FixturesTableComponent],
  templateUrl: './fixture-detail.component.html',
  styleUrls: ['./fixture-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixtureDetailComponent {
  protected readonly state = inject(ControlStateService);
}
