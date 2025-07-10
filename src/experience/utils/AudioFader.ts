import type { Audio, PositionalAudio } from "three";
import gsap from "gsap";

class AudioFader {
  static fadeIn(audio: Audio | PositionalAudio, to: number, duration = 2) {
    audio.setVolume(0);
    const gain = audio.gain.gain;
    gain.value = 0;
    audio.play();
    gsap.to(gain, { value: to, duration });
  }
}
export default AudioFader;
