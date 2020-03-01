function Deferred () {
    let fnResolve;
    let fnReject;
    const oPromise = new Promise((resolve, reject) => {
        fnResolve = resolve;
        fnReject = reject;
    });
    return {
        promise: oPromise,
        resolve: fnResolve,
        reject: fnReject
    };
};

module.exports = Deferred;
