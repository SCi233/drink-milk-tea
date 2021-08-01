import { delay } from './utils';
import * as AudioManager from './AudioManager';
import * as WaterAnimManager from './waterAnimManager';
import * as StrawAnimManager from './strawAnimManager';

const container = document.querySelector('#container');

let isLongPress = false;
let isPlayingLongPressAnim = false;

const handleClickCup = () => {
  console.log('container clicked');
  StrawAnimManager.playRiseAnim();
  WaterAnimManager.playDrinkAnim({})
    .then(() => StrawAnimManager.playDropAnim());
  AudioManager.playAudio(AudioManager.AUDIOS.DRINK);
};

const updateWater = (elapsedTime?: number) => {
  if (isLongPress && !isPlayingLongPressAnim) {
    isPlayingLongPressAnim = true;
    const doPlayDrinkAnim = () => {
      WaterAnimManager.playDrinkAnim({})
        .then(() => {
          isLongPress && doPlayDrinkAnim();
        });
      AudioManager.playAudio(AudioManager.AUDIOS.DRINK);
    };
    doPlayDrinkAnim();
  }
}

const setupTouchEvents = () => {
  let touchStartTime;
  let longPressTimerDisposer;

  const handleTouchStart = () => {
    touchStartTime = window.performance.now();
    // console.log('container touchstart', touchStartTime);

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
    // console.log('container touchend', window.performance.now());

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
}

const setupEvents = () => {
  console.log('setupEvents');
  setupTouchEvents();
}

const mainLoop = (timestamp?: number) => {
  // console.log('mainLoop', timestamp);
  updateWater();
  window.requestAnimationFrame(mainLoop);
}

window.onload = () => {
  setupEvents();
  mainLoop(window.performance.now());
}
