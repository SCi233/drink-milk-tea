const app = document.querySelector('#app');
const container = document.querySelector('#container');
const drinkAudio = document.querySelector('#drink-audio');
const maskStrawRect = document.querySelector('#maskstraw-rect');
const maskWaterRect = document.querySelector('#maskwater-rect');
const maskWaterWavePath = document.querySelector('#maskwaterwave-path');
const maskWaterWaveAnim = document.querySelector('#maskwaterwave-anim');

const setupEvents = () => {
  console.log('setupEvents');
  container.addEventListener('click', () => {
    console.log('body clicked');
    let curY = +maskStrawRect.getAttribute('y');
    curY = (curY + 50) < 587 ? curY + 50 : 587;
    if (curY >= 0) {
      maskStrawRect.setAttribute('y', curY);
      maskWaterRect.setAttribute('y', curY);
      // changeWaterWaveMask(curY);
      maskWaterWavePath.style.transform = `translateY(${ curY - 300 }px)`
    }
    if (drinkAudio) {
      try {
        drinkAudio.play();
      } catch (error) {
        console.error('fail to play audio', error);
      }
    }
  });
}

window.onload = () => {
  console.log('hello world');
  setupEvents();
}
