import GUI from "lil-gui";

class Debug {
  readonly instance: GUI;

  constructor() {
    this.instance = new GUI({ title: "Tweaks", closeFolders: true });
  }

  dispose() {
    this.instance.destroy();
  }
}

export default Debug;
