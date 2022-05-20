import { Scroll } from './Scroll.js';
import { Strip } from './Strip.js';
import { clearObject3D } from './clear.js';

class Gui {
  constructor(scene, render) {
    document.getElementById('param-num-layer').value = 7;
    document.getElementById('param-amp').value = 0.7;
    document.getElementById('param-x-scale').value = 180;
    document.getElementById('param-y-scale').value = 20;

    const updateParam = (ev) => {
      const el = ev.target;
      const elId = el.id;

      el.parentElement.getElementsByClassName('param-value')[0].innerHTML = el.value;

      clearObject3D(scene);

      if (elId.includes('-amp')) {
        Strip.AMPLITUDE = 1.000005 * el.value;
      } else if (elId.includes('-num-layer')) {
        Scroll.NSTRIPS_ONSCREEN = el.value;
        Scroll.STRIP_HEIGHT = window.innerHeight / Scroll.NSTRIPS_ONSCREEN;
      } else if (elId.includes('-x-scale')) {
        Strip.DIVERSITY_X = el.value;
      } else if (elId.includes('-y-scale')) {
        Strip.DIVERSITY_Y = el.value;
      }

      window.mScroll = new Scroll(scene, render);
    };

    Array.from(document.getElementsByTagName('input')).forEach(el => {
      el.addEventListener('change', updateParam);
      el.parentElement.getElementsByClassName('param-value')[0].innerHTML = el.value;
    });
  }
}

export { Gui }
