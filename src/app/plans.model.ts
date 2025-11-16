export interface FixtureSettings {
  [key: string]: unknown;
}

export interface Fixture {
  name: string;
  universe: number;
  channel: number;
  wifi_mac_address: string;
  player_type: string;
  fqbn: string;
  fixture_type: string;
  fixture_settings: FixtureSettings;
  plan: string;
  plan_group: string;
}

export interface Plan {
  id: string;
  label: string;
  fixtures: Fixture[];
  fixtureCount: number;
}

export interface PlansResponse {
  active: string;
  plans: Plan[];
}
