import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';
import { ControlStateService } from '../../services/control-state.service';

const IP_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;

@Component({
  selector: 'app-artnet-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artnet-config.component.html',
  styleUrl: './artnet-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'artnet-config',
  },
})
export class ArtnetConfigComponent {
  private readonly state = inject(ControlStateService);
  private readonly toastTimer = signal<ReturnType<typeof setTimeout> | null>(null);

  @ViewChild('dialog', { static: true })
  private readonly dialog?: ElementRef<HTMLDialogElement>;

  protected readonly artnetIp = signal('');
  protected readonly universe = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly toastMessage = signal<string | null>(null);

  protected readonly canApply = computed(() => {
    const ip = this.artnetIp().trim();
    const universe = this.universe();

    return IP_PATTERN.test(ip) && universe !== null && universe >= 0;
  });

  protected openDialog(): void {
    const config = this.state.config();

    if (config) {
      this.artnetIp.set(config.artnetIp ?? '');
      this.universe.set(config.universe ?? null);
    }

    this.dialog?.nativeElement.showModal();
  }

  protected closeDialog(): void {
    this.dialog?.nativeElement.close();
  }

  protected handleIpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value
      .replace(/[^\d.]/g, '')
      .slice(0, 15)
      .split('')
      .reduce(
        (result, char) => {
          if (char === '.') {
            if (result.segment.length === 0 || result.dotCount >= 3) {
              return result;
            }

            result.value += '.';
            result.segment = '';
            result.dotCount += 1;
            return result;
          }

          if (result.segment.length < 3) {
            result.segment += char;
            result.value += char;
          }

          return result;
        },
        { value: '', segment: '', dotCount: 0 }
      ).value;

    this.artnetIp.set(sanitized);
    input.value = sanitized;
  }

  protected handleUniverseInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = Number.parseInt(input.value, 10);

    if (Number.isNaN(parsed)) {
      this.universe.set(null);
      input.value = '';
      return;
    }

    this.universe.set(parsed);
  }

  protected applySettings(): void {
    if (!this.canApply()) {
      return;
    }

    this.isSaving.set(true);
    this.state
      .updateConfig({
        artnetIp: this.artnetIp().trim(),
        universe: this.universe() ?? 0,
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.closeDialog();
          this.showToast('Art-Net settings updated');
        },
        error: (error) => console.error('Failed to update Art-Net config', error),
      });
  }

  protected dismissToast(): void {
    this.toastMessage.set(null);
    const timer = this.toastTimer();
    if (timer) {
      clearTimeout(timer);
      this.toastTimer.set(null);
    }
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);

    const existingTimer = this.toastTimer();
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.toastMessage.set(null);
      this.toastTimer.set(null);
    }, 3000);

    this.toastTimer.set(timer);
  }
}
