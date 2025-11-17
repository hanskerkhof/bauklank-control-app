import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sound-library-summary',
  standalone: true,
  imports: [],
  templateUrl: './sound-library-summary.component.html',
  styleUrls: ['./sound-library-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundLibrarySummaryComponent {
  readonly summary = input<string | null>(null);
}
