import { TweenOptions, TWEEN_STATE, Tween } from './tween';

export class TweenManager {
  private tweens = new Set<Tween>();

  constructor () {
    this.mainLoop();
  }

  private mainLoop = (elapsedTime?: number) => {
    try {
      this.update(elapsedTime);
    } catch (error) {
      console.error('fail to update tween, error: ' + error);
    }

    window.requestAnimationFrame(this.mainLoop);
  }

  private update (elapsedTime?: number) {
    this.tweens.forEach(tween => tween.update(elapsedTime));
  }

  add (options: TweenOptions) {
    const tween = new Tween(options);

    const disposer = () => this.remove(tween);
    tween.onComplete(disposer);
    tween.onStop(disposer);

    this.tweens.add(tween);
    tween.start();
    return tween;
  }

  remove (tween: Tween) {
    if (this.tweens.has(tween)) {
      tween.stop();
      this.tweens.delete(tween);
    } else {
      console.warn('fail to remove tween, can not found.');
    }
  }

  pause (tween: Tween) {
    if (this.tweens.has(tween)) {
      tween.pause();
    } else {
      console.warn('fail to pause tween, can not found.');
    }
  }

  stop (tween: Tween) {
    this.remove(tween);
  }
}
