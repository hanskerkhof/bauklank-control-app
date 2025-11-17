import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmxViewerComponent } from '../../shared/dmx-viewer/dmx-viewer.component';
import { ControlStateService } from '../../services/control-state.service';

@Component({
  selector: 'app-dmx-control',
  standalone: true,
  imports: [CommonModule, DmxViewerComponent],
  templateUrl: './dmx-control.component.html',
  styleUrls: ['./dmx-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DmxControlComponent {
  protected readonly state = inject(ControlStateService);
}
