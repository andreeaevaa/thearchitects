
class Subject {
    constructor() {
      
        this.observers = [];
    }

   
    subscribe(fn) {
        this.observers.push(fn);
    }

  
    notify(data) {
        this.observers.forEach(subscriber => subscriber(data));
    }
}


const scannerSubject = new Subject();
module.exports = scannerSubject;