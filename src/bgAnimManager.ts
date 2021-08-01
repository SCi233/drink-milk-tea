const bgCircle = document.querySelector('#bg-circle-front');

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

// tweenManger.add({
//   targets: [circleProxy],
//   attrs: {
//     r: 600,
//   },
//   duration: 1000,
//   easing: Easing.Cubic.Out,
// });
