class Scene {
  static layers = document.getElementById("my-layer-container");
  static shadow = document.getElementById("my-shadow-div");
  static info = document.getElementById("my-info-button");

  static setup() {
    window.scrollTo(0, 0);
    Scene.layers.innerHTML = "";
    Scene.layers.style.marginTop = "0px";
  }

  static resizeShadow() {
    Scene.shadow.style.height = `${window.innerHeight}px`;
  }

  static setLayersMarginTop(maxNoiseHeight) {
    const layersTop = Scene.layers.children[1].getBoundingClientRect()["top"];
    const layersOffsetY = window.innerHeight - (layersTop - 0.5 * maxNoiseHeight);
    Scene.layers.style.marginTop = `${layersOffsetY}px`;
  }

  static update() {
    const shadowOpacity = window.pageYOffset / window.innerHeight;
    const infoOpacity = 1.0 - shadowOpacity;

    Scene.shadow.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
    Scene.info.style.opacity = Math.max(0, Math.min(1, infoOpacity));
    Scene.info.style.display = infoOpacity <= 0 ? "none" : "block";
  }

  static getTopLayerTop() {
    return Scene.layers.children[0].getBoundingClientRect()["top"];
  }

  static getTopLayerId() {
    return parseInt(Scene.layers.children[0].id.replace("mylayer", ""));
  }

  static getBottomLayerBottom() {
    return Scene.layers.lastChild.getBoundingClientRect()["bottom"];
  }

  static getBottomLayerId() {
    return parseInt(Scene.layers.lastChild.id.replace("mylayer", ""));
  }

  static addBottom(el) {
    Scene.layers.append(el);
  }

  static addTop(el) {
    Scene.layers.prepend(el);
  }

  static removeBottom() {
    Scene.layers.removeChild(Scene.layers.lastChild);
  }

  static removeTop() {
    Scene.layers.removeChild(Scene.layers.firstChild);
  }
}

export { Scene };
