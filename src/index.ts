import { Tween, Easing } from './libs/tween';
import { delay } from './utils';

const tweens = new Set<Tween>();

const container = document.querySelector('#container');
const drinkAudio: HTMLAudioElement = document.querySelector('#drink-audio');
const maskStrawRect = document.querySelector('#maskstraw-rect');
const cupBodyWtaer: SVGPathElement = document.querySelector('#cup-body-wtaer');
const maskWaterWavePath = document.querySelector('#maskwaterwave-path');
const maskWaterWaveAnim: SVGAnimationElement = document.querySelector('#maskwaterwave-anim');
const bgCircle = document.querySelector('#bg-circle-front');

const drinkCapacity = 20;

let isLongPress = false;
let isPlayingWaveAnim = false;

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
  if (!maskWaterWaveAnim) {
    return;
  }

  if (isPlayingWaveAnim) {
    return;
  }

  isPlayingWaveAnim = true;
  (maskWaterWaveAnim as any).beginElement();
}

const waterProxy = new Proxy({
  y: +maskStrawRect.getAttribute('y'),
}, {
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
  let waveAnimDelay = 0;
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

    waveAnimDelay = 200;
  }
  delay(waveAnimDelay).promise.then(() => playWaterWobbleAnim());
  playAudio();
};

const updateWater = (elapsedTime?: number) => {
  if (isLongPress) {
    let curY = waterProxy.y;
    const newY = (curY + 0.3) < 587 ? curY + 0.3 : 587;
    waterProxy.y = newY;
  }
}

const setupTouchEvents = () => {
  let touchStartTime;
  let longPressTimerDisposer;

  const handleTouchStart = () => {
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
  };

  const handleTouchEnd = () => {
    console.log('container touchend', window.performance.now());

    longPressTimerDisposer();

    if (!isLongPress) {
      handleClickCup();
    } else {
      isLongPress = false;
    }
  };

  container.addEventListener('touchstart', handleTouchStart);
  container.addEventListener('touchend', handleTouchEnd);
  container.addEventListener('mousedown', handleTouchStart);
  container.addEventListener('mouseup', handleTouchEnd);

  maskWaterWaveAnim.addEventListener('endEvent', () => {
    isPlayingWaveAnim = false;
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
    easing: Easing.Cubic.Out,
  });
  tweens.add(tween);
  // delay(2000).promise.then(() => tween.start());
  // tween.start();
}
