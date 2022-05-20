import * as THREE from './three/three.module.js';
import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';

const CAM_FOV = 150;
const LAYERS_Y_OFFSET = -window.innerHeight / 2.0 - (Scroll.STRIP_HEIGHT + 0.5 * Strip.AMPLITUDE * Scroll.STRIP_HEIGHT);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAM_FOV, window.innerWidth / window.innerHeight, 1, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true });

let currentHeight = window.innerHeight;
function setupScene() {
  if (window.innerHeight < currentHeight) return;

  currentHeight = window.innerHeight;
  document.getElementById('my-shadow-div').style.height = `${window.innerHeight}px`;

  const camZ = (window.innerHeight / 2) / Math.tan(CAM_FOV / 2 * Math.PI / 180);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, 0, camZ);
  camera.updateProjectionMatrix();

  scene.background = new THREE.Color(0x000000);

  scene.position.setX(-window.innerWidth / 2);
  if (window.mScroll === undefined) {
    scene.position.setY(LAYERS_Y_OFFSET);
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.render(scene, camera);
}
window.addEventListener('resize', setupScene);

window.addEventListener('DOMContentLoaded', () => {
  // THREEJS
  setupScene();
  renderer.domElement.classList.add('my-canvas');
  document.getElementById('my-container').appendChild(renderer.domElement);

  // INFO
  document.getElementById('hide-overlay-button').addEventListener('click', hideOverlay);
  document.getElementById('my-popup').addEventListener('click', (e) => e.stopPropagation());
  document.getElementById('my-overlay').addEventListener('click', hideOverlay);
  document.getElementById('my-info-button').addEventListener('click', showOverlay);

  window.mScroll = new Scroll(scene, () => renderer.render(scene, camera));
});

const onScrollCommon = (deltaY) => {
  scene.position.setY(Math.max(LAYERS_Y_OFFSET, scene.position.y + deltaY));
  renderer.render(scene, camera);

  const mShadowDiv = document.getElementById('my-shadow-div');
  const mInfoButton = document.getElementById('my-info-button');

  const shadowOpacity = 2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight;
  const infoOpacity = 1.0 - (2 * (scene.position.y - LAYERS_Y_OFFSET) / window.innerHeight);

  mShadowDiv.style.opacity = Math.max(0, Math.min(1, shadowOpacity));
  mInfoButton.style.opacity = Math.max(0, Math.min(1, infoOpacity));
  mInfoButton.style.display = (infoOpacity <= 0) ? 'none' : 'block';

  window.mScroll.update(scene.position.y);
};

const onScrollDesktop = (event) => {
  event.preventDefault();
  const deltaY = event.deltaY;
  onScrollCommon(deltaY);
};
window.addEventListener('wheel', onScrollDesktop, { passive: false });

let touchDownY = null;
window.addEventListener('touchstart', (event) => {
  touchDownY = event.touches[0].clientY;
});

const onScrollMobile = (event) => {
  event.preventDefault();
  const deltaY = event.touches[0].clientY - touchDownY;
  touchDownY = event.touches[0].clientY;
  onScrollCommon(-deltaY);
}
window.addEventListener('touchmove', onScrollMobile, { passive: false });

const hideOverlay = (event) => {
  document.getElementById('my-overlay').style.opacity = 0;
  setTimeout(() => document.getElementById('my-overlay').style.display = 'none', 200);
  window.addEventListener('wheel', onScrollDesktop, { passive: false });
  window.addEventListener('touchmove', onScrollMobile, { passive: false });
  window.removeEventListener('keyup', checkEscKey);
};

const showOverlay = (event) => {
  document.getElementById('my-overlay').style.display = 'flex';
  setTimeout(() => document.getElementById('my-overlay').style.opacity = 1, 100);
  window.removeEventListener('wheel', onScrollDesktop);
  window.removeEventListener('touchmove', onScrollMobile);
  window.addEventListener('keyup', checkEscKey);
};

const checkEscKey = (event) => {
  if(event.key && (event.key === 'Escape' || event.key === 'Esc')) {
    hideOverlay();
  }
}

const RUNNING_LOCAL = !window.location.href.includes('infinitum');

if (RUNNING_LOCAL) {
  const mCaptureScript = document.createElement('script');

  mCaptureScript.onload = () => {
    const CAPTURE_TIME_S = 5 * 60;
    const CAPTURE_FRAMERATE = 30;
    let captureFrameCount = 0;

    const capturer = new CCapture({
      format: 'webm',
      framerate: CAPTURE_FRAMERATE,
      verbose: true,
      name: 'infinitum_30fps_5min',
      timeLimit: CAPTURE_TIME_S,
      autoSaveTime: CAPTURE_TIME_S
    });

    const autoScrollSetup = () => {
      if (scene.position.y < Scroll.STRIP_HEIGHT * Scroll.NSTRIPS_TOTAL) {
        onScrollCommon(1.5 * Scroll.STRIP_HEIGHT);
        requestAnimationFrame(autoScrollSetup);
      } else {
        onScrollCommon(-1.5 * scene.position.y);
      }
    };

    const autoScroll = () => {
      if (captureFrameCount++ < (CAPTURE_TIME_S * CAPTURE_FRAMERATE)) {
        onScrollCommon(1);
        requestAnimationFrame(autoScroll);
        capturer.capture(renderer.domElement);
      }
    };

    const checkAnimationKeys = (event) => {
      if (event.key && (event.key === 'a' || event.key === 'f') && Scroll.NSTRIPS_TOTAL == 100) {
        document.getElementById('my-info-button').style.transform = 'scale(0)';
        Scroll.NSTRIPS_TOTAL = 256;
        window.mScroll = new Scroll(scene, () => renderer.render(scene, camera));
        window.mScroll.update = (e) => {};
        setTimeout(autoScrollSetup, 2000);
        return;
      }

      if (event.key === 'a') {
        captureFrameCount = 0;
        capturer.start();
        autoScroll();
      }
      else if (event.key === 's') capturer.save();
      else if (event.key === 'f') autoScrollSetup();
    }

    window.addEventListener('keyup', checkAnimationKeys);
  };

  mCaptureScript.src = './js/ccapture/CCapture.all.min.js';
  document.head.appendChild(mCaptureScript);
}
