import { delay } from './utils';
import * as AudioManager from './AudioManager';
import * as WaterAnimManager from './waterAnimManager';
import * as StrawAnimManager from './strawAnimManager';

const container = document.querySelector('#container');

let isLongPress = false;
let isPlayingLongPressAnim = false;

const handleClickCup = () => {
  console.log('container clicked');
  AudioManager.playAudio(AudioManager.AUDIOS.DRINK);
  StrawAnimManager.playRiseAnim();
  WaterAnimManager.playDrinkAnim({})
    .then(() => StrawAnimManager.playDropAnim())
    .catch((error) => { console.warn(error); });
};

const updateWater = (elapsedTime?: number) => {
  if (isLongPress && !isPlayingLongPressAnim) {
    isPlayingLongPressAnim = true;
    const doPlayDrinkAnim = () => {
      AudioManager.playAudio(AudioManager.AUDIOS.DRINK);
      StrawAnimManager.playRiseAnim();
      WaterAnimManager.playDrinkAnim({})
        .then(() => {
          if (isLongPress) {
            doPlayDrinkAnim()
          } else {
            isPlayingLongPressAnim = false;
            StrawAnimManager.playDropAnim()
          }
        })
        .catch((error) => { console.warn(error); });
    };
    doPlayDrinkAnim();
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
      console.log('start long press.');
      isLongPress = true;
    });
  };

  const handleTouchEnd = () => {
    console.log('container touchend', window.performance.now());

    longPressTimerDisposer();

    if (!isLongPress) {
      handleClickCup();
    } else {
      console.log('end long press.');
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
