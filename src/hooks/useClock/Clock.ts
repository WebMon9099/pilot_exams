import { v4 as uuidv4 } from 'uuid';

export interface ClockEvent {
  callback: () => void;
  initialTime: number;
  paused: boolean;
  time: number;

  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

class Clock {
  private events: Map<string, ClockEvent> = new Map();

  constructor() {
    this.clockEventsLoop();
  }

  private clockEventsLoop() {
    var lastUpdate = Date.now();

    const loop = () => {
      const thisUpdate = Date.now();

      this.events.forEach((event) => {
        if (event.paused) return;

        event.time -= thisUpdate - lastUpdate;

        if (event.time <= 0) {
          event.callback();
          event.time = event.initialTime;
        }
      });

      lastUpdate = thisUpdate;

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  public addInterval(callback: () => void, time: number) {
    const newId = uuidv4();

    const newEvent = {
      callback,
      initialTime: time,
      paused: false,
      time,
      pause: () => this.pause(newId),
      resume: () => this.resume(newId),
      cancel: () => this.cancel(newId),
    };

    this.events.set(newId, newEvent);

    return newEvent;
  }

  private cancel(id: string) {
    this.events.delete(id);
  }

  private pause(id: string) {
    const event = this.events.get(id);

    if (!event) return;

    this.events.set(id, { ...event, paused: true });
  }

  private resume(id: string) {
    const event = this.events.get(id);

    if (!event) return;

    this.events.set(id, { ...event, paused: false });
  }
}

export default Clock;
