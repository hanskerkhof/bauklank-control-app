import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
} from '@angular/core';
import { WsService } from './ws.service';
import { DmxViewerComponent } from './dmx-viewer.component';
import { WsStatusComponent } from './ws-status.component';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, DmxViewerComponent, WsStatusComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-shell',
  },
})
export class App {
  private readonly ws = inject(WsService);
  protected readonly dmx = computed(() => this.ws.dmx());

  constructor() {
    this.ws.connect();
  }
}

// // src/app/app.ts
// import {
//   Component,
//   ChangeDetectionStrategy,
//   computed,
//   inject,
// } from '@angular/core';
// import { WsService } from './ws.service';
// import { DmxViewerComponent } from './dmx-viewer.component';
//
// @Component({
//   selector: 'app-root',
//   imports: [DmxViewerComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   host: {
//     class: 'app-shell',
//   },
// })
// export class App {
//   private readonly ws = inject(WsService);
//
//   protected readonly dmx = computed(() => this.ws.dmx());
//
//   constructor() {
//     this.ws.connect();
//   }
// }
