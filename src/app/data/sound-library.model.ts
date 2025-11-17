export interface SoundTrack {
  id: number;
  name: string;
  durationMs: number;
  filename: string;
}

export interface SoundLibrary {
  plan: string;
  tracks: SoundTrack[];
}
