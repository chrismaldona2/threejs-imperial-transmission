import type { Audio, PositionalAudio } from "three";

export type SupportedAudio = Audio | PositionalAudio;

class AudioRegistry {
  private audios: Record<string, SupportedAudio> = {};

  register(name: string, audio: SupportedAudio) {
    this.audios[name] = audio;
  }

  get(name: string): SupportedAudio {
    if (!this.audios[name])
      throw new Error(`'${name}' audio was not found inside AudioRegistry. `);

    return this.audios[name];
  }
}

export default AudioRegistry;
