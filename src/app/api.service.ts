import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from './app.config';
import { PlansResponse } from './data/plans.model';
import { ControlConfig } from './data/config.model';

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

  getSoundLibrary(): Observable<any> {
    return this.http.get(`${this.cfg.apiBase}/soundLibrary`);
  }

  getState(): Observable<any> {
    return this.http.get(`${this.cfg.apiBase}/state`);
  }

  getDmx(): Observable<any> {
    return this.http.get(`${this.cfg.apiBase}/dmx`);
  }
}
