// // v2 taiga
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { WsService } from './ws.service';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-ws-status',
  imports: [TuiBadge],
  templateUrl: './ws-status.component.html',
  styleUrls: ['./ws-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ws-status-host' },
})
export class WsStatusComponent {
  private readonly ws = inject(WsService);
  protected readonly status = computed(() => this.ws.status());
  protected readonly isConnected = computed(
    () => this.ws.status() === 'connected',
  );
}

// import {
//   ChangeDetectionStrategy,
//   Component,
//   computed,
//   inject,
// } from '@angular/core';
// import { WsService } from './ws.service';
// import { TuiBadge } from '@taiga-ui/kit';
//
// @Component({
//   selector: 'app-ws-status',
//   imports: [TuiBadge],
//   templateUrl: './ws-status.component.html',
//   styleUrls: ['./ws-status.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   host: {
//     class: 'ws-status-host',
//   },
// })
// export class WsStatusComponent {
//   private readonly ws = inject(WsService);
//
//   protected readonly status = computed(() => this.ws.status());
//   protected readonly isConnected = computed(
//     () => this.ws.status() === 'connected',
//   );
// }
//
// // import {
// //   ChangeDetectionStrategy,
// //   Component,
// //   computed,
// //   inject,
// // } from '@angular/core';
// // import { WsService } from './ws.service';
// //
// // @Component({
// //   selector: 'app-ws-status',
// //   templateUrl: './ws-status.component.html',
// //   styleUrls: ['./ws-status.component.scss'],
// //   changeDetection: ChangeDetectionStrategy.OnPush,
// //   host: {
// //     class: 'ws-status-host',
// //   },
// // })
// // export class WsStatusComponent {
// //   private readonly ws = inject(WsService);
// //
// //   protected readonly status = computed(() => this.ws.status());
// //   protected readonly isConnected = computed(() => this.ws.status() === 'connected');
// // }
