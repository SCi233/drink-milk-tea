import { TweenManager, Easing } from './libs/tween';
import { delay } from './utils';
import { MAX_WATER_MASK_Y } from './constants';

interface Options {
  offsetY?: number,
  duration?: number,
};

const DEFAULT_OPTIONS = {
  offsetY: 20,
  duration: 1000,
};

const maskStrawRect = document.querySelector('#maskstraw-rect');
const cupBodyWtaer: SVGPathElement = document.querySelector('#cup-body-wtaer');
const maskWaterWavePath = document.querySelector('#maskwaterwave-path');
const maskWaterWaveAnim: SVGAnimationElement = document.querySelector('#maskwaterwave-anim');

const tweenManager = new TweenManager();

let isPlayingWaveAnim = false;
let waveAnimQueue = 0;

let runningWaveAnimDisposer: () => void;

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

const playWaterWobbleAnim = () => {
  if (!maskWaterWaveAnim) {
    return;
  }

  if (isPlayingWaveAnim) {
    return;
  }

  if (waveAnimQueue <= 0) {
    return;
  }

  --waveAnimQueue;
  isPlayingWaveAnim = true;
  (maskWaterWaveAnim as any).beginElement();
};

if (maskWaterWaveAnim) {
  console.log('register maskWaterWaveAnim events.');
  maskWaterWaveAnim.addEventListener('endEvent', () => {
    console.log('endEvent trigger.');
    isPlayingWaveAnim = false;
    if (waveAnimQueue > 0) {
      playWaterWobbleAnim();
    }
  });
}

const playWaterDownAnim = (targetY: number, duration: number) => {
  let disposer: () => void;
  const promise = new Promise<void>((resolve, reject) => {
    const tween = tweenManager.add({
      targets: [waterProxy],
      attrs: { y: targetY, },
      duration: duration,
      easing: Easing.Cubic.InOut,
    });
    tween.onComplete(() => {
      console.log('complete.');
      runningWaveAnimDisposer = () => {};
      resolve();
    });

    disposer = () => {
      tween.stop();
      runningWaveAnimDisposer = () => {};
      reject('anim cancel.');
    };
  });

  return { promise, disposer }
};

const calTargetY = (offsetY: number): number => {
  let targetY = waterProxy.y;
  targetY = (targetY + offsetY) < MAX_WATER_MASK_Y ? targetY + offsetY : MAX_WATER_MASK_Y;
  return targetY;
}

export const playDrinkAnim = (options: Options) => {
  let {
    offsetY = DEFAULT_OPTIONS.offsetY,
    duration = DEFAULT_OPTIONS.duration,
  } = options;

  if (offsetY <= 0) { offsetY = DEFAULT_OPTIONS.offsetY; }
  if (duration <= 0) { duration = DEFAULT_OPTIONS.duration; }

  let targetY = calTargetY(offsetY);
  if (targetY <= 0) {
    return Promise.resolve();
  } else {
    runningWaveAnimDisposer?.();

    if (waveAnimQueue > 0) {
      waveAnimQueue = 3;
    } else {
      delay(targetY > 0 ? 200 : 0).promise.then(() => {
        waveAnimQueue = 3;
        playWaterWobbleAnim();
      });
    }

    const { promise, disposer } = playWaterDownAnim(targetY, duration);
    runningWaveAnimDisposer = disposer;

    return promise;
  }
};
