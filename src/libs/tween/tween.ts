// @ts-check

import { EventEmitter } from '../event-emitter';

export interface TweenOptions {
  targets: Record<string, any>[];
  attrs: Record<string, number>;
  duration: number;
  easing?: ((progress: number)=>number);
};

export enum TWEEN_STATE {
  RUNNING = 1,
  PAUSED,
  STOP,
};

export class Tween {
  static EVENTS = {
    START: 'start',
    PAUSED: 'paused',
    COMPLETE: 'complete',
    STOP: 'stop',
  }

  private state: TWEEN_STATE = TWEEN_STATE.PAUSED;

  private targets: Record<string, any>[];

  private targetStatesMap: Map<Record<string, any>, Record<string, {from: number, to: number}>> = new Map();

  private duration: number;

  private easing: (progress: number)=>number;

  private startTime: number;

  private pausedTime: number;

  private pausedDuration: number = 0;

  private event = new EventEmitter();

  constructor (options: TweenOptions) {
    const { targets, attrs, duration, easing, } = options;

    this.targets = targets;
    this.duration = duration;
    this.easing = easing;

    this.targets.forEach(target => {
      const keys = Object.keys(attrs);
      const attrStates: { [s: string]: { from: number; to: number; }; } = {}
      for (const key of keys) {
        const value = target[key];
        if (value !== null || value !== undefined) {
          attrStates[key] = {
            from: value,
            to: attrs[key],
          }
        }
      }
      this.targetStatesMap.set(target, attrStates);
    });
  }

  update (elapsedTime: number) {
    if (this.state !== TWEEN_STATE.RUNNING) {
      return;
    }

    const now = Date.now();
    const totalElapsedTime = now - this.startTime - this.pausedDuration;
    let originProgress = totalElapsedTime / this.duration;
    if (originProgress > 1) {
      originProgress = 1;
    }
    let progress = originProgress;
    if (this.easing) {
      progress = this.easing(originProgress);
    }

    this.targetStatesMap.forEach((attrStates, target) => {
      for (const [key, {from, to}] of Object.entries(attrStates)) {
        const v = from + (to - from) * progress;
        target[key] = v;
      }
    });

    if (originProgress >= 1) {
      this.state = TWEEN_STATE.STOP;
      this.event.emit(Tween.EVENTS.COMPLETE);
    }
  }

  start () {
    if (this.state && this.state !== TWEEN_STATE.PAUSED) {
      return;
    }

    this.state = TWEEN_STATE.RUNNING;

    if (!this.startTime) {
      this.startTime = Date.now();
    }
    if (this.pausedTime) {
      this.pausedDuration += Date.now() - this.pausedTime;
      this.pausedTime = 0;
    }

    this.event.emit(Tween.EVENTS.START);
  }

  pause () {
    if (this.state !== TWEEN_STATE.RUNNING) {
      return;
    }

    this.state = TWEEN_STATE.PAUSED;
    this.pausedTime = Date.now();
    this.event.emit(Tween.EVENTS.PAUSED);
  }

  stop () {
    if (this.state === TWEEN_STATE.STOP) {
      return;
    }

    this.state = TWEEN_STATE.STOP
    this.event.emit(Tween.EVENTS.STOP);
  }

  onStart (cb: (...args: any[]) => void) {
    this.event.addEventListener(Tween.EVENTS.START, cb);
  }

  onPaused (cb: (...args: any[]) => void) {
    this.event.addEventListener(Tween.EVENTS.PAUSED, cb);
  }

  onComplete (cb: (...args: any[]) => void) {
    this.event.addEventListener(Tween.EVENTS.COMPLETE, cb);
  }

  onStop (cb: (...args: any[]) => void) {
    this.event.addEventListener(Tween.EVENTS.STOP, cb);
  }
}
