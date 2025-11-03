import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from './app.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private cfg: AppConfig,
  ) {}

  getPlans(): Observable<any> {
    return this.http.get(`${this.cfg.apiBase}/plans`);
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
