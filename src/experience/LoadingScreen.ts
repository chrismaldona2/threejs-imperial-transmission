import gsap from "gsap";
import Experience from "./Experience";

const classNames = {
  container: "loading_screen",
  saberContainer: "saber_container",
  saberHilt: "saber_hilt",
  saberLight: "saber_light",
} as const;

class LoadingScreen {
  private readonly resources = Experience.getInstance().resources;

  private container!: HTMLDivElement;
  private saberContainer!: HTMLDivElement;
  private saberHilt!: SVGElement;
  private saberLight!: HTMLDivElement;

  constructor() {
    this.setupContainer();
    this.setupSaber();
    this.addListeners();
  }

  update() {
    const progress = Math.round(this.resources.progress);
    gsap.to(this.saberLight, {
      scaleX: progress,
      transformOrigin: "left center",
      duration: 0.25,
      ease: "power2.out",
    });
  }

  destroy() {
    gsap.to(this.container, {
      duration: 1.25,
      opacity: 0,
      ease: "power2.inOut",
      onComplete: () => {
        this.container.remove();
      },
    });
  }

  private addListeners() {
    this.resources.on("fileLoaded", () => this.update());
    this.resources.on("loadEnd", () => this.destroy());
  }

  private setupContainer() {
    this.container = document.createElement("div");
    this.container.classList.add(classNames.container);
    document.body.appendChild(this.container);
  }

  private setupSaber() {
    this.saberContainer = document.createElement("div");
    this.saberContainer.classList.add(classNames.saberContainer);
    this.saberHilt = this.getHiltSvg();
    this.saberLight = document.createElement("div");
    this.saberLight.classList.add(classNames.saberLight);
    this.saberContainer.append(this.saberHilt, this.saberLight);
    this.container.appendChild(this.saberContainer);
  }

  private getHiltSvg(): SVGElement {
    const create = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
      return el;
    };

    const svg = create("svg", {
      width: "228",
      height: "111",
      viewBox: "0 0 228 111",
      fill: "none",
      class: classNames.saberHilt,
    });

    const children = [
      create("rect", {
        x: "168",
        y: "4",
        width: "42",
        height: "33",
        rx: "12",
        fill: "#313942",
      }),
      create("rect", {
        x: "115",
        y: "24",
        width: "113",
        height: "62",
        rx: "14",
        fill: "#95A5A5",
      }),
      create("path", {
        d: "M0 33C0 24.1634 7.16344 17 16 17H130.176C135.946 17 141.27 20.1074 144.107 25.1321L169.521 70.1321C175.544 80.798 167.838 94 155.589 94H16C7.16344 94 0 86.8366 0 78V33Z",
        fill: "#485052",
      }),
      create("rect", {
        x: "30",
        y: "0",
        width: "38",
        height: "111",
        rx: "16",
        fill: "#303840",
      }),
      create("rect", {
        x: "30",
        y: "31",
        width: "38",
        height: "48",
        fill: "#646D76",
      }),
    ];

    for (const el of children) svg.appendChild(el);
    return svg;
  }
}

export default LoadingScreen;
