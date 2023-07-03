import SimplexNoise from "./simplex-noise/simplex-noise.js";
import { by_rgb } from "./by_rgb.js";
import { by_hls } from "./by_hls.js";

class Strip {
  // static NOISE = new SimplexNoise(new Date());
  static NOISE = new SimplexNoise("infinitum");
  static MOBILE_WIDTH = 1090;
  static NUM_POINTS_X = 256.0;

  // amp: [0.6, 1.0]
  static AMPLITUDE = 0.7;

  // y-diversity: [20, 45]
  static DIVERSITY_Y = 20.0;

  // x-diversity: [160, 200]
  static DIVERSITY_X = 180.0;

  static DIVERSITY_X_HIGH_FACTOR = 4.0;
  static DIVERSITY_X_HIGH_AMP = 0.2;

  static BY_COLOR = JSON.parse(by_rgb).concat(JSON.parse(by_hls));

  static HORIZONTAL = window.innerWidth > window.innerHeight;

  static createTestElement(i, h) {
    const el = document.createElement("div");
    el.id = `mylayer${i}`;
    el.classList.add("layer");
    el.style.height = `${h}px`;
    el.innerHTML = `${i}`;
    return el;
  }

  static createSvgElement(i, width, svgH, imgH, imgFile) {
    const offsetY = (imgH - svgH) / 2;
    const marginTop = i === 1 ? 0.5 * svgH * Strip.AMPLITUDE : 0;

    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    el.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    el.id = `mylayer${i}`;
    el.classList.add("layer");
    el.style.height = `${svgH}px`;
    el.style.marginTop = `${-marginTop}px`;

    el.innerHTML = `
    <defs>
      <pattern id="img${i}" patternUnits="userSpaceOnUse" width="${width}px" height="${imgH}px" x="0" y="-${offsetY}">
        <image href="${imgFile}" x="0" y="0" width="${width}px" height="${imgH}px" />
      </pattern>
    </defs>`;
    return el;
  }

  static makeTopLayer(width) {
    const imgFile = `assets/imgs/map-${Strip.HORIZONTAL ? "horizontal" : "vertical"}.webp`;
    const imgWidth = Strip.HORIZONTAL ? 1920.0 : 1080.0;
    const imgHeight = Strip.HORIZONTAL ? 1300.0 : 2160.0;
    const aspectRatio = imgWidth / imgHeight;
    const height = width / aspectRatio;

    const el = Strip.createSvgElement(0, width, height, height, imgFile);
    const elPath = `<path d="M0,0 L0,${height} L${width},${height} L${width},0 z" fill="url(#img0)"></path>`;
    el.innerHTML = el.innerHTML + " " + elPath;

    return el;
  }

  static makeLayer(height, yidx) {
    const width = window.innerWidth;
    if (yidx === 0) {
      return Strip.makeTopLayer(width);
    }
    // return Strip.createTestElement(yidx, height);

    const isFullWidth = width * window.devicePixelRatio > Strip.MOBILE_WIDTH;

    const numPointsX = isFullWidth ? Strip.NUM_POINTS_X : 0.5 * Strip.NUM_POINTS_X;
    const diversityX = Strip.HORIZONTAL ? Strip.DIVERSITY_X : 0.5 * Strip.DIVERSITY_X;
    const deltaX = width / numPointsX;

    let pathString = `M0,${height}`;
    for (let i = 0; i <= numPointsX; i++) {
      const x = i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / diversityX, yidx / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, yidx / Strip.DIVERSITY_Y);

      const firstLayerDamp = yidx === 1 ? 0.5 : 1.0;
      const y = firstLayerDamp * height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      pathString += ` L${x},${y}`;
    }

    for (let i = 0; i <= numPointsX; i++) {
      const x = width - i * deltaX;
      const y_noise = Strip.NOISE.noise2D(x / diversityX, (yidx + 1) / Strip.DIVERSITY_Y);
      const y_noise_h = Strip.NOISE.noise2D(Strip.DIVERSITY_X_HIGH_FACTOR * x / diversityX, (yidx + 1) / Strip.DIVERSITY_Y);

      const y = height * Strip.AMPLITUDE * (y_noise + Strip.DIVERSITY_X_HIGH_AMP * y_noise_h);
      pathString += ` L${x},${height + y}`;
    }
    pathString += ` L0,${height} z`;

    const imgFile = `assets/textures/${isFullWidth ? "1920" : "1024"}/${Strip.BY_COLOR[yidx % Strip.BY_COLOR.length]}.jpg`;
    const imgWidth = isFullWidth ? 1920.0 : 1024.0;
    const imgHeight = isFullWidth ? 640.0 : 342.0;
    const aspectRatio = imgWidth / imgHeight;
    const imgDisplayHeight = width / aspectRatio;

    const el = Strip.createSvgElement(yidx, width, height, imgDisplayHeight, imgFile);
    const elPath = `<path d="${pathString}" fill="url(#img${yidx})"></path>`;
    el.innerHTML = el.innerHTML + " " + elPath;

    return el;
  }
}

export { Strip };
