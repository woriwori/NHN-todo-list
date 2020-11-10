export default class ListenerHelper {
  constructor() {
    this.listeners = new Map();
  }
  add(element, type, handler) {
    const handlers = this.getHandlers(element, type);
    handlers.push(handler);
  }
  remove(element, type, handler) {
    const filteredHandlers = this.getHandlers(element, type).filter((f) => f !== handler);
    this.setHandlers(element, type, filteredHandlers);
  }
  getEventTypes(element) {
    // return : Map { click => [], focus => [], ... }
    const isEmptyEventTypes = !this.listeners.has(element);
    if (isEmptyEventTypes) {
      return this.listeners.set(element, new Map()).get(element);
    }

    return this.listeners.get(element);
  }
  getHandlers(element, type) {
    // return :  [ () => {..}, ... ]
    const eventTypes = this.getEventTypes(element);
    const hasEventType = eventTypes.has(type);
    let handlers = eventTypes.get(type);

    if (!hasEventType) {
      handlers = this.initializeHandlers(eventTypes, type);
    }

    return handlers;
  }
  initializeHandlers(eventTypes, type) {
    return eventTypes.set(type, []).get(type);
  }
  setHandlers(element, type, handlers) {
    this.getEventTypes(element).set(type, handlers);
  }
}
