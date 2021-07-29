import { Tween } from './tween.js';
import * as Easing from './easing.js';
import { delay } from './utils.js';

const tweens = new Set();

const container = document.querySelector('#container');
const drinkAudio = document.querySelector('#drink-audio');
const maskStrawRect = document.querySelector('#maskstraw-rect');
const cupBodyWtaer = document.querySelector('#cup-body-wtaer');
const maskWaterWavePath = document.querySelector('#maskwaterwave-path');
const maskWaterWaveAnim = document.querySelector('#maskwaterwave-anim');
const bgCircle = document.querySelector('#bg-circle-front');

const drinkCapacity = 20;

let isLongPress = false;

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

const handleClickCup = () => {
  console.log('container clicked');
  let curY = waterProxy.y;
  curY = (curY + drinkCapacity) < 587 ? curY + drinkCapacity : 587;
  if (curY >= 0) {
    // waterProxy.y = curY;
    const tween = new Tween({
      targets: [waterProxy],
      attrs: {
        y: curY,
      },
      duration: 1000,
      easing: Easing.Cubic.InOut,
    });
    tweens.add(tween);
    tween.start();
  }
  playAudio();
  playWaterWobbleAnim();
};

const updateWater = (elapsedTime) => {
  if (isLongPress) {
    let curY = waterProxy.y;
    const newY = (curY + 0.3) < 587 ? curY + 0.3 : 587;
    waterProxy.y = newY;
  }
}

const setupTouchEvents = () => {
  let touchStartTime;
  let longPressTimerDisposer;

  container.addEventListener('touchstart', () => {
    touchStartTime = window.performance.now();
    console.log('container touchstart', touchStartTime);

    const {
      promise: delayPromise,
      disposer: delayDisposer,
    } = delay(350);
    longPressTimerDisposer = delayDisposer;

    delayPromise.then(() => {
      isLongPress = true;
    });
  });

  container.addEventListener('touchend', () => {
    console.log('container touchend', window.performance.now());

    longPressTimerDisposer();

    if (!isLongPress) {
      handleClickCup();
    } else {
      isLongPress = false;
    }
  });
}

const setupEvents = () => {
  console.log('setupEvents');
  setupTouchEvents();
}

const mainLoop = (timestamp) => {
  // console.log('mainLoop', timestamp);
  tweens.forEach(tween => tween.update(timestamp));
  updateWater();
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
    duration: 1000,
    easing: Easing.Cubic.InOut,
  });
  tweens.add(tween);
  // delay(2000).promise.then(() => tween.start());
  // tween.start();
}
