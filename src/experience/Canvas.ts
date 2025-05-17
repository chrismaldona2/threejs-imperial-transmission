class Canvas {
  domElement: HTMLCanvasElement;

  constructor() {
    this.domElement = document.createElement("canvas");
    this.domElement.id = "webgl_canvas";

    /* MOUNT */
    document.body.appendChild(this.domElement);
  }

  destroy() {
    this.domElement.remove();
  }
}

export default Canvas;
