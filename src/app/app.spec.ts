import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ApiService } from './services/api.service';
import { WsService } from './services/ws.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ControlConfig } from './data/config.model';
import { PlansResponse } from './data/plans.model';
import { SoundLibrary } from './data/sound-library.model';

class MockWsService {
  private readonly dmxSignal = signal(null);
  readonly dmx = this.dmxSignal.asReadonly();

  connect(): void {}
}

class MockApiService {
  private readonly plans: PlansResponse = { active: 'default', plans: [] };
  private readonly config: ControlConfig = {
    artnetIp: '127.0.0.1',
    universe: 0,
    plan: 'default',
    planPath: '/default',
  };
  private readonly soundLibrary: SoundLibrary = { plan: 'default', tracks: [] };

  getPlans() {
    return of(this.plans);
  }

  getConfig() {
    return of(this.config);
  }

  updateConfig(config: ControlConfig) {
    return of(config);
  }

  getSoundLibrary() {
    return of(this.soundLibrary);
  }

  restart() {
    return of(void 0);
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: ApiService, useClass: MockApiService },
        { provide: WsService, useClass: MockWsService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('BAUKLANK CONTROL');
  });
});
