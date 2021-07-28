import { Tween } from './tween.js';
import * as Easing from './easing.js';

const tweens = new Set();

const container = document.querySelector('#container');
const drinkAudio = document.querySelector('#drink-audio');
const maskStrawRect = document.querySelector('#maskstraw-rect');
const cupBodyWtaer = document.querySelector('#cup-body-wtaer');
const maskWaterWavePath = document.querySelector('#maskwaterwave-path');
const maskWaterWaveAnim = document.querySelector('#maskwaterwave-anim');
const bgCircle = document.querySelector('#bg-circle');

const playAudio = () => {
  if (drinkAudio) {
    try {
      drinkAudio.play();
    } catch (error) {
      console.error('fail to play audio', error);
    }
  }
}

const playWaterWobbleAnim = () => {
  if (maskWaterWaveAnim) {
    maskWaterWaveAnim.beginElement();
  }
}

const waterProxy = new Proxy({}, {
  get: (target, key, receiver) => {
    switch (key) {
      case 'y':
        return +maskStrawRect.getAttribute('y');
      default:
        return Reflect.get(target, key, receiver);
    }
  },
  set: (target, key, value, receiver) => {
    switch (key) {
      case 'y':
        maskStrawRect.setAttribute('y', value);
        cupBodyWtaer.style.transform = `translateY(${ value - 300 }px)`;
        return true;
      default:
        return Reflect.set(target, key, value, receiver);
    }
  }
});

const circleProxy = new Proxy({}, {
  get: (target, key, receiver) => {
    switch (key) {
      case 'r':
        return +bgCircle.getAttribute('r');
      default:
        return Reflect.get(target, key, receiver);
    }
  },
  set: (target, key, value, receiver) => {
    switch (key) {
      case 'r':
        bgCircle.setAttribute('r', value);
        return true;
      default:
        return Reflect.set(target, key, value, receiver);
    }
  }
});

const setupEvents = () => {
  console.log('setupEvents');
  container.addEventListener('click', () => {
    console.log('body clicked');
    let curY = waterProxy.y;
    curY = (curY + 50) < 587 ? curY + 50 : 587;
    if (curY >= 0) {
      waterProxy.y = curY;
    }
    playAudio();
    playWaterWobbleAnim();
  });
}

const mainLoop = (timestamp) => {
  // console.log('mainLoop', timestamp);
  tweens.forEach(tween => tween.update(timestamp));
  window.requestAnimationFrame(mainLoop);
}

window.onload = () => {
  console.log('hello world');
  setupEvents();
  mainLoop(window.performance.now());

  const tween = new Tween({
    targets: [circleProxy],
    attrs: {
      r: 600,
    },
    duration: 600,
    easing: Easing.Linear.None,
  });
  tweens.add(tween);
  // tween.start();
}
