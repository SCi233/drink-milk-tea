import { TweenManager, Easing } from './libs/tween';
import { MAX_WATER_MASK_Y } from './constants';

const maskStrawDrinkingRect = document.querySelector('#mask-straw-drinking-rect');
const maskStrawRect = document.querySelector('#maskstraw-rect');

const tweenManager = new TweenManager();

const strawProxy = new Proxy({
  y: +maskStrawDrinkingRect.getAttribute('y'),
}, {
  get: (target, key, receiver) => {
    switch (key) {
      case 'y':
        return +maskStrawDrinkingRect.getAttribute('y');
      default:
        return Reflect.get(target, key, receiver);
    }
  },
  set: (target, key, value, receiver) => {
    switch (key) {
      case 'y':
        maskStrawDrinkingRect.setAttribute('y', value);
        return true;
      default:
        return Reflect.set(target, key, value, receiver);
    }
  }
});

export const playRiseAnim = () => {
  const curMaskY = +maskStrawDrinkingRect.getAttribute('y');
  if (curMaskY >= MAX_WATER_MASK_Y) {
    return;
  }

  tweenManager.add({
    targets: [strawProxy],
    attrs: { y: 100 },
    duration: 200,
    easing: Easing.Quadratic.In,
  });
};

export const playDropAnim = () => {
  const curMaskY = +maskStrawDrinkingRect.getAttribute('y');
  if (curMaskY >= MAX_WATER_MASK_Y) {
    return;
  }

  const targetY = +maskStrawRect.getAttribute('y');
  if (targetY !== null || targetY !== undefined) {
    tweenManager.add({
      targets: [strawProxy],
      attrs: { y: targetY, },
      duration: 160,
      easing: Easing.Quadratic.Out,
    });
  }
}
