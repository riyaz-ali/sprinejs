//- A Promise-based middleware implementation
// https://gist.github.com/riyaz-ali/9a6c421664cdff14b5d18543e24afe60

let nextTick = 'undefined' !== typeof process
    ? process.nextTick
    : 'undefined' !== typeof setImmediate
        ? setImmediate
        : setTimeout;

module.exports = class Middleware {
    /** create a new Middleware */
    constructor(){
        this.middlewares=[]
    }

    /** add a function to middleware stack */
    use(fn){
        if(!fn || typeof fn !== "function"){
            throw new TypeError("Argument to use must be of type 'Function'")
        }

        this.middlewares.push(fn)
    }

    /** execute the middlewares */
    exec(...args){
        return new Promise((resolve, reject) => {
            // check for early exit
            if(!this.middlewares.length)
                return resolve(...args)

            // kickstart the chain
            let _execute = (i, ...args0) => {
                nextTick(() => {
                    this.middlewares[i]((...returnValue) => {
                        if(returnValue.length && returnValue[0] instanceof Error)
                            return reject(returnValue[0])
                        else if(i >= this.middlewares.length - 1)
                            return resolve(...returnValue)
                        else
                            return _execute(i+1, ...returnValue)
                    }, ...args0)
                }, 1)
            }

            _execute(0, ...args)
        })
    }
}