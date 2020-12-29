export class EventTarget {
    addEventListener (eventName, Handler) {
        console.error("EventTarget.addEventListener should be implemented by the derived class");
    }

    removeEventListener (eventName, Handler) {
        console.error("EventTarget.removeEventListener should be implemented by the derived class");
    }
}
