import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../app.config';
import { DmxPayload } from './ws.service';
import { PlansResponse } from '../data/plans.model';
import { ControlConfig } from '../data/config.model';
import { SoundLibrary } from '../data/sound-library.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private cfg: AppConfig,
  ) {}

  getPlans(): Observable<PlansResponse> {
    return this.http.get<PlansResponse>(`${this.cfg.apiBase}/plans`);
  }

  getConfig(): Observable<ControlConfig> {
    return this.http.get<ControlConfig>(`${this.cfg.apiBase}/config`);
  }

  updateConfig(config: ControlConfig): Observable<ControlConfig> {
    return this.http.put<ControlConfig>(`${this.cfg.apiBase}/config`, config);
  }

  getSoundLibrary(): Observable<SoundLibrary> {
    return this.http.get<SoundLibrary>(`${this.cfg.apiBase}/soundLibrary`);
  }

  restart(): Observable<void> {
    return this.http.post<void>(`${this.cfg.apiBase}/restart`, {});
  }

  getState(): Observable<any> {
    return this.http.get(`${this.cfg.apiBase}/state`);
  }

  getDmx(): Observable<DmxPayload> {
    return this.http.get<DmxPayload>(`${this.cfg.apiBase}/dmx`);
  }
}
