// src/app/ws.service.ts
import {
  Injectable,
  NgZone,
  computed,
  inject,
  signal,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from './app.config';

type WsMessageType = 'state' | 'dmx' | string;

interface WsMessage<T = unknown> {
  type: WsMessageType;
  data: T;
}

export interface DmxPayload {
  universe: number;
  channels: number[];
}

export interface StatePayload {
  [key: string]: unknown;
}

type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private readonly zone = inject(NgZone);
  private readonly cfg = inject<AppConfig>(APP_CONFIG);

  private socket?: WebSocket;

  // signals
  private readonly stateSignal = signal<StatePayload | null>(null);
  private readonly dmxSignal = signal<DmxPayload | null>(null);
  private readonly statusSignal = signal<WsStatus>('disconnected');

  // reconnect
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;

  readonly state = this.stateSignal.asReadonly();
  readonly dmx = this.dmxSignal.asReadonly();
  readonly status = this.statusSignal.asReadonly();

  readonly isConnected = computed(() => this.statusSignal() === 'connected');

  connect(): void {
    // avoid multiple connections
    if (this.socket && this.statusSignal() !== 'disconnected') {
      return;
    }

    this.statusSignal.set('connecting');

    const ws = new WebSocket(this.cfg.wsUrl);
    this.socket = ws;

    ws.onopen = () => {
      this.zone.run(() => {
        this.statusSignal.set('connected');
        this.reconnectAttempts = 0;
        if (this.reconnectTimer !== null) {
          window.clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      });
    };

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
        this.statusSignal.set('disconnected');
        this.socket = undefined;
        this.scheduleReconnect();
      });
    };

    ws.onerror = () => {
      this.zone.run(() => {
        this.statusSignal.set('error');
        this.socket = undefined;
        this.scheduleReconnect();
      });
    };
  }

  private scheduleReconnect(): void {
    // basic backoff: 1s, 2s, 4s, … up to 30s
    const attempt = this.reconnectAttempts + 1;
    this.reconnectAttempts = attempt;
    const delay = Math.min(1000 * 2 ** (attempt - 1), 30000);

    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// // src/app/ws.service.ts
// import {
//   Injectable,
//   NgZone,
//   inject,
//   signal,
//   computed,
// } from '@angular/core';
// import { APP_CONFIG, AppConfig } from './app.config';
//
// type WsMessageType = 'state' | 'dmx' | string;
//
// interface WsMessage<T = unknown> {
//   type: WsMessageType;
//   data: T;
// }
//
// export interface DmxPayload {
//   universe: number;
//   channels: number[]; // expect length 512, but we won't assume in code
// }
//
// export interface StatePayload {
//   [key: string]: unknown;
// }
//
// @Injectable({
//   providedIn: 'root',
// })
// export class WsService {
//   private readonly zone = inject(NgZone);
//   private readonly cfg = inject<AppConfig>(APP_CONFIG);
//
//   private socket?: WebSocket;
//
//   private readonly stateSignal = signal<StatePayload | null>(null);
//   private readonly dmxSignal = signal<DmxPayload | null>(null);
//
//   // readonly views
//   readonly state = this.stateSignal.asReadonly();
//   readonly dmx = this.dmxSignal.asReadonly();
//
//   // optional: derived channel count, useful in views
//   readonly dmxChannelCount = computed(() => this.dmxSignal()?.channels.length ?? 0);
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
//       this.zone.run(() => {
//         const msg = JSON.parse(evt.data) as WsMessage;
//
//         if (msg.type === 'state') {
//           this.stateSignal.set(msg.data as StatePayload);
//         } else if (msg.type === 'dmx') {
//           this.dmxSignal.set(msg.data as DmxPayload);
//         }
//       });
//     };
//
//     ws.onclose = () => {
//       this.zone.run(() => {
//         this.socket = undefined;
//         // we can add retry logic later
//       });
//     };
//   }
// }
