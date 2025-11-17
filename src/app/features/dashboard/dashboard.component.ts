import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundLibraryTableComponent } from '../../shared/sound-library-table/sound-library-table.component';
import { ControlStateService } from '../../services/control-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SoundLibraryTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly state = inject(ControlStateService);
}
