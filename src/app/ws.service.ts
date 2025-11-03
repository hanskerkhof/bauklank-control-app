// src/app/ws.service.ts
import {
  Injectable,
  NgZone,
  inject,
  signal,
  computed,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from './app.config';

type WsMessageType = 'state' | 'dmx' | string;

interface WsMessage<T = unknown> {
  type: WsMessageType;
  data: T;
}

export interface DmxPayload {
  universe: number;
  channels: number[]; // expect length 512, but we won't assume in code
}

export interface StatePayload {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private readonly zone = inject(NgZone);
  private readonly cfg = inject<AppConfig>(APP_CONFIG);

  private socket?: WebSocket;

  private readonly stateSignal = signal<StatePayload | null>(null);
  private readonly dmxSignal = signal<DmxPayload | null>(null);

  // readonly views
  readonly state = this.stateSignal.asReadonly();
  readonly dmx = this.dmxSignal.asReadonly();

  // optional: derived channel count, useful in views
  readonly dmxChannelCount = computed(() => this.dmxSignal()?.channels.length ?? 0);

  connect(): void {
    if (this.socket) {
      return;
    }

    const ws = new WebSocket(this.cfg.wsUrl);
    this.socket = ws;

    ws.onmessage = (evt) => {
      this.zone.run(() => {
        const msg = JSON.parse(evt.data) as WsMessage;

        if (msg.type === 'state') {
          this.stateSignal.set(msg.data as StatePayload);
        } else if (msg.type === 'dmx') {
          this.dmxSignal.set(msg.data as DmxPayload);
        }
      });
    };

    ws.onclose = () => {
      this.zone.run(() => {
        this.socket = undefined;
        // we can add retry logic later
      });
    };
  }
}

// import { Inject, Injectable, NgZone } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { APP_CONFIG, AppConfig } from './app.config';
//
// interface WsMessage {
//   type: string;
//   data: any;
// }
//
// @Injectable({ providedIn: 'root' })
// export class WsService {
//   private socket?: WebSocket;
//
//   // latest snapshots
//   state$ = new BehaviorSubject<any | null>(null);
//   dmx$ = new BehaviorSubject<any | null>(null);
//
//   // raw stream if you want to inspect/log
//   messages$ = new Subject<WsMessage>();
//
//   constructor(
//     private zone: NgZone,
//     @Inject(APP_CONFIG) private cfg: AppConfig,
//   ) {}
//
//   connect(): void {
//     if (this.socket) {
//       return;
//     }
//
//     const ws = new WebSocket(this.cfg.wsUrl);
//     this.socket = ws;
//
//     ws.onmessage = (evt) => {
//       // ensure Angular knows something changed
//       this.zone.run(() => {
//         const msg = JSON.parse(evt.data) as WsMessage;
//         this.messages$.next(msg);
//
//         if (msg.type === 'state') {
//           this.state$.next(msg.data);
//         } else if (msg.type === 'dmx') {
//           this.dmx$.next(msg.data);
//         }
//       });
//     };
//
//     ws.onclose = () => {
//       this.zone.run(() => {
//         this.socket = undefined;
//         // optional: add auto-reconnect later
//       });
//     };
//   }
// }
