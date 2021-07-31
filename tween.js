// @ts-check

import { EventEmitter } from './event.js';

/**
 * @typedef {Object} TweenOptions
 * @property {Object.<string, any>[]} targets
 * @property {Object.<string, number>} attrs
 * @property {number} duration
 * @property {(progress: number)=>number} easing
 */

/** @enum {number} */
const TWEEN_STATE = {
  RUNNING: 1,
  PAUSED: 2,
  STOP: 3,
};

export class Tween {
  static EVENTS = {
    START: 'start',
    PAUSED: 'paused',
    COMPLETE: 'complete',
  }

  /** @type {TWEEN_STATE}*/
  state = TWEEN_STATE.PAUSED;

  /** @type {Object.<string, any>[]}*/
  targets;

  /** @type {Map<Object.<string, any>, Object.<string, {from: number, to: number}>>}*/
  targetStatesMap = new Map();

  /** @type {number} */
  duration;

  /** @type {(progress: number)=>number} */
  easing;

  /** @type {number} */
  startTime;

  /** @type {number} */
  pausedTime;

  /** @type {number} */
  pausedDuration = 0;

  event = new EventEmitter();

  /**
   * @constructor
   * @param {TweenOptions} options
   */
  constructor (options) {
    const { targets, attrs, duration, easing, } = options;

    this.targets = targets;
    this.duration = duration;
    this.easing = easing;

    this.targets.forEach(target => {
      const keys = Object.keys(attrs);
      /** @type {Object.<string, {from: number, to: number}>} */
      const attrStates = {}
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

  /**
   * @param {number} [elapsedTime]
   * @returns void
   */
  update (elapsedTime) {
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
    if (!this.state || this.state === TWEEN_STATE.PAUSED) {
      this.state = TWEEN_STATE.RUNNING;
    } else {
      return;
    }

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
    if (this.state === TWEEN_STATE.RUNNING) {
      this.state = TWEEN_STATE.PAUSED;
      this.pausedTime = Date.now();
    } else {
      return;
    }

    this.event.emit(Tween.EVENTS.PAUSED);
  }

  onStart (cb) {
    this.event.addEventListener(Tween.EVENTS.START, cb);
  }

  onPaused (cb) {
    this.event.addEventListener(Tween.EVENTS.PAUSED, cb);
  }

  onComplete (cb) {
    this.event.addEventListener(Tween.EVENTS.COMPLETE, cb);
  }
}
