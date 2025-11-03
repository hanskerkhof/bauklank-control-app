import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { DmxPayload } from './ws.service';

@Component({
  selector: 'app-dmx-viewer',
  templateUrl: './dmx-viewer.component.html',
  styleUrls: ['./dmx-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dmx-viewer',
  },
})
export class DmxViewerComponent {
  readonly dmx = input<DmxPayload | null>(null);

  protected readonly channels: Signal<number[]> = computed(() => {
    const d = this.dmx();
    return d?.channels ?? [];
  });

  protected readonly universe: Signal<number | null> = computed(() => {
    const d = this.dmx();
    return d ? d.universe : null;
  });

  // tracks which indices are currently flashing
  protected readonly changed = signal<boolean[]>([]);

  private previousChannels: number[] = [];
  private clearTimers: number[] = [];

  constructor() {
    effect(() => {
      const current = this.channels();
      const prev = this.previousChannels;

      if (current.length === 0) {
        this.changed.set([]);
        this.previousChannels = [];
        this.clearAllTimers();
        return;
      }

      // detect changes
      const nextChanged = new Array<boolean>(current.length).fill(false);

      for (let i = 0; i < current.length; i++) {
        const currVal = current[i];
        const prevVal = typeof prev[i] === 'number' ? prev[i] : null;

        if (prevVal !== null && currVal !== prevVal) {
          nextChanged[i] = true;
          this.scheduleClear(i);
        }
      }

      // merge with currently flashing ones
      this.changed.update((oldArr) => {
        const merged: boolean[] = [];
        for (let i = 0; i < current.length; i++) {
          merged[i] = nextChanged[i] || (oldArr[i] ?? false);
        }
        return merged;
      });

      this.previousChannels = current.slice();
    });
  }

  private scheduleClear(index: number): void {
    const timeoutId = window.setTimeout(() => {
      this.changed.update((arr) => {
        if (index >= arr.length) {
          return arr;
        }
        const next = arr.slice();
        next[index] = false;
        return next;
      });
    }, 500);

    this.clearTimers.push(timeoutId);
  }

  private clearAllTimers(): void {
    for (const id of this.clearTimers) {
      window.clearTimeout(id);
    }
    this.clearTimers = [];
  }
}
