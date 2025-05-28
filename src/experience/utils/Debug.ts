import GUI from "lil-gui";

class Debug {
  readonly instance: GUI;

  constructor() {
    this.instance = new GUI({ title: "Tweaks" });
  }

  dispose() {
    this.instance.destroy();
  }
}

export default Debug;
