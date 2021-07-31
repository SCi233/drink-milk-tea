export const EVENTS ={
  ERROR: 'error',
};

export class EventEmitter {
  eventMap = new Map();

  addEventListener (eventName, listener) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, [listener]);
    } else {
      this.eventMap.get(eventName).push(listener);
    }
  }

  removeEventListener (eventName, listener) {
    if (this.eventMap.has(eventName)) {
      const listeners = this.eventMap.get(eventName);
      const index = listeners.findIndex(el => el === listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  on (eventName, listener) {
    this.addEventListener(eventName, listener);
  }

  once (eventName, listener) {
    this.addEventListener(eventName, (...args) => {
      this.removeEventListener(eventName, listener);
      listener(...args);
    });
  }

  emit (eventName, ...args) {
    if (this.eventMap.has(eventName)) {
      const listeners = this.eventMap.get(eventName);
      listeners.forEach(el => {
        try {
          el(...args);
        } catch (error) {
          console.error(`fail to excute event ${eventName}, error: `, error);
          this.emit(EVENTS.ERROR, error);
        }
      });
    }
  }
}
