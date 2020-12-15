export class Deferred {
    constructor () {
        this.isFulfilled = false;
        this.isPending = true;
        this.isRejected = false;

        this.promise = new Promise((resolve, reject) => {
            this.resolve = (...args) => {
                this.isFulfilled = true;
                this.isPending = false;
                this.isRejected = false;

                resolve(...args);
            };

            this.reject = (...args) => {
                this.isFulfilled = false;
                this.isPending = false;
                this.isRejected = true;

                reject(...args);
            };
        });
    }
}
