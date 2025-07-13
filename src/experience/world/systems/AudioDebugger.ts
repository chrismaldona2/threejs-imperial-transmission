import type GUI from "lil-gui";
import Experience from "../../Experience";
import type { SupportedAudio } from "../../utils/AudioRegistry";
import { PositionalAudio } from "three";

class SoundDebugger {
  private readonly experience = Experience.getInstance();
  private readonly debug = this.experience.debug.instance;
  private readonly resources = this.experience.resources;
  private readonly audioRegistry = this.experience.audioRegistry;

  private ambient: SupportedAudio;
  private vaderBreath: SupportedAudio;
  private hologramSwitch: SupportedAudio;
  private backgroundMusic: SupportedAudio;
  private tweaks: GUI;

  constructor() {
    this.ambient = this.audioRegistry.get("ambient_sound");
    this.vaderBreath = this.audioRegistry.get("vader_breath");
    this.hologramSwitch = this.audioRegistry.get("hologram_switch");
    this.backgroundMusic = this.audioRegistry.get("background_music");
    this.tweaks = this.debug.addFolder("Sound");
    this.setupBackgroundMusicTweaks();
    this.setupGenericTweaksFolder("Ambient Sound", this.ambient);
    this.setupGenericTweaksFolder("Vader Breath", this.vaderBreath);
    this.setupGenericTweaksFolder("Hologram Switch", this.hologramSwitch);
  }

  dispose() {
    this.tweaks.destroy();
  }

  private setupBackgroundMusicTweaks() {
    const buffers: Record<string, AudioBuffer> = {
      "Droid March": this.resources.get<AudioBuffer>("droid_march_audio"),
      "Imperial March": this.resources.get<AudioBuffer>("imperial_march_audio"),
    };
    const controls = {
      active: "Droid March", // Can be different, must check
    };
    const folder = this.tweaks.addFolder("Background Music");
    folder
      .add(controls, "active")
      .options(Object.keys(buffers))
      .name("Active Track")
      .onChange(() => {
        this.backgroundMusic.stop();
        this.backgroundMusic.setBuffer(buffers[controls.active]);
        this.backgroundMusic.play();
      });
    this.setupGeneralAudioTweaks(this.backgroundMusic, folder);
  }

  private setupGenericTweaksFolder(label: string, audio: SupportedAudio) {
    const folder = this.tweaks.addFolder(label);
    this.setupGeneralAudioTweaks(audio, folder);
    if (audio instanceof PositionalAudio)
      this.setupPositionalAudioTweaks(audio, folder);
  }

  private setupGeneralAudioTweaks(audio: SupportedAudio, gui: GUI) {
    gui
      .add(
        {
          get volume() {
            return Math.round(audio.getVolume() * 1000) / 1000;
          },
          set volume(v: number) {
            audio.setVolume(v);
          },
        },
        "volume"
      )
      .min(0)
      .max(1)
      .step(0.001)
      .name("Volume")
      .listen();
  }

  private setupPositionalAudioTweaks(audio: PositionalAudio, gui: GUI) {
    const controls = {
      refDistance: audio.getRefDistance(),
    };
    gui
      .add(controls, "refDistance")
      .name("Reference Dist")
      .min(0)
      .max(2)
      .step(0.001)
      .onChange(() => {
        audio.setRefDistance(controls.refDistance);
      });
  }
}

export default SoundDebugger;
