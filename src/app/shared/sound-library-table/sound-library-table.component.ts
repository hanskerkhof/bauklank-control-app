import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundLibrary, SoundTrack } from '../../data/sound-library.model';

@Component({
  selector: 'app-sound-library-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sound-library-table.component.html',
  styleUrls: ['./sound-library-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundLibraryTableComponent {
  readonly library = input<SoundLibrary | null>(null);

  protected readonly tracks = computed<SoundTrack[]>(() => this.library()?.tracks ?? []);
  protected readonly planName = computed(() => this.library()?.plan ?? null);

  protected formatDuration(durationMs: number): string {
    if (!Number.isFinite(durationMs)) {
      return '—';
    }

    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
