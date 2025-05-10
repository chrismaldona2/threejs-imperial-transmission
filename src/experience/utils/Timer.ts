import { Timer as THREETimer } from "three/examples/jsm/Addons.js";
import EventEmitter from "./EventEmitter";

class Timer extends EventEmitter {
  readonly instance: THREETimer;
  elapsed: number = 0;

  constructor() {
    super();
    this.instance = new THREETimer();
    this.tick();
  }

  private tick = () => {
    window.requestAnimationFrame(this.tick);
    this.instance.update();
    this.elapsed = this.instance.getElapsed();
    this.trigger("tick");
  };

  dispose() {
    this.instance.dispose();
    this.off("tick");
  }
}

export default Timer;
