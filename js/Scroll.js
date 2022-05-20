import * as THREE from './three/three.module.js';
import { Strip } from './Strip.js';
import { clearObject3D } from './clear.js';

class Scroll {
  constructor(scene, render) {
    this.scene = scene;
    this.meshes = Array(Scroll.NSTRIPS_TOTAL);
    this.previousTopIdx = 0;

    for (let i = 0; i < Scroll.NSTRIPS_TOTAL; i++) {
      this.meshes[i] = Strip.getMesh(window.innerWidth, Scroll.STRIP_HEIGHT, i, render);
      scene.add(this.meshes[i]);
    }
  }

  update(topPosition) {
    const topIdx = Math.max(0, Math.floor(topPosition / Scroll.STRIP_HEIGHT - (Scroll.NSTRIPS_TOTAL / 2)));

    if (topIdx == 0 && this.previousTopIdx == 0) return;

    if (topIdx > this.previousTopIdx) {
      for (var i = this.previousTopIdx; i < topIdx; i++) {
        this.scene.remove(this.meshes[i % Scroll.NSTRIPS_TOTAL]);
        clearObject3D(this.meshes[i % Scroll.NSTRIPS_TOTAL]);

        this.meshes[i % Scroll.NSTRIPS_TOTAL] = Strip.getMesh(window.innerWidth, Scroll.STRIP_HEIGHT, i + Scroll.NSTRIPS_TOTAL);
        this.scene.add(this.meshes[i % Scroll.NSTRIPS_TOTAL]);
      }
    } else if (topIdx < this.previousTopIdx) {
      for (var i = this.previousTopIdx - 1; i > topIdx - 1; i--) {
        this.scene.remove(this.meshes[i % Scroll.NSTRIPS_TOTAL]);
        clearObject3D(this.meshes[i % Scroll.NSTRIPS_TOTAL]);

        this.meshes[i % Scroll.NSTRIPS_TOTAL] = Strip.getMesh(window.innerWidth, Scroll.STRIP_HEIGHT, i);
        this.scene.add(this.meshes[i % Scroll.NSTRIPS_TOTAL]);
      }
    }

    this.previousTopIdx = topIdx;
  }
}

Scroll.NSTRIPS_TOTAL = 100;
Scroll.NSTRIPS_ONSCREEN = 7;
Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;

export { Scroll };
