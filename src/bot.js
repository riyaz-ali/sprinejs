// inherit from EventEmitter
const EventEmitter = require('events').EventEmitter
const axios = require("axios")

const _sendAPI = require("./send")
const FacebookEvent = require("./FacebookEvent")

/**
 * class representing a single Bot
 * This is the base class for all interaction with the sprine facebook-messenger api
 * This class' instance is responsible to parse event data from Facebook and fire events that your code can listen to
 * and respond accordingly.
 *
 * This class' implementation is inspired from the Bot class here (https://github.com/remixz/messenger-bot/blob/master/index.js)
 */
class Bot extends EventEmitter {
    /**
     * create a Bot
     * @param {object} opts - This object must have a key 'token'
     */
    constructor (opts) {
        super()

        opts = opts || {}
        if (!opts.token) {
            throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart')
        }
        this.token = opts.token
        this.app_secret = opts.app_secret || false
        this.verify_token = opts.verify || false

        //- axios instance for this bot
        this._axios = axios.create({
            baseURL: `https://graph.facebook.com/${opts['version'] || '2.6'}`
        });

        if(opts.subscribe){
            this.subscribe()
        }
    }

    /**
     * create a Facebook App subscription for page. You can call it on initialization by setting :subscribe: key.
     * @param {Function} cb - Optional callback to call instead of handling promise
     * @facebook
     * @return {*}
     */
    subscribe(cb){
        return this._axios.post("/me/subscribed_apps", {}, {
            params: { access_token: this.token }
        }).then(ignored => {
            if(cb) cb()
        }).catch(error => {
            if(!cb) return Promise.reject(error)
            cb(error)
        })
    }


    /**
     * Fetch the profile of the user using User Profile API
     * @param {string} id - Page-scoped ID of the User
     * @param {Function} cb - Optional callback function to call instead of using promise
     * @return {Promise}
     */
    getProfile(id, cb){
        return axios.get(`/${id}`, {
            params: {
                fields: "first_name,last_name,profile_pic,locale,timezone,gender",
                access_token: this.token
            }
        }).then(resp => {
            if(resp.data.error) return Promise.reject(resp.data.error)
            if(!cb) return resp.data
            cb(null, resp.data)
        }).catch(error => {
            if(!cb) return Promise.resolve(error)
            cb(error)
        })
    }


    /**
     * Set a Messenger Profile field
     * @param {string} field - the field to set
     * @param {object} payload - the field's payload
     * @param {Function} cb
     * @return {Promise}
     */
    setField (field, payload, cb) {
        return this._axios.post("/me/messenger_profile", {
            [field]: payload
        }, {
            params: { access_token: this.token }
        }).then(data => {
            if(data.data.error) return Promise.reject(data.data.error)
            if(!cb) return data.data
            cb(null, data.data)
        }).catch(error => {
            if(!cb) return Promise.reject(error)
            cb(error)
        })
    }

    /**
     * Delete a Messenger Profile field
     * @param {string} field - the field to delete
     * @param {Function} cb
     * @return {Promise}
     */
    deleteField (field, cb) {
        return this._axios.delete("/me/messenger_profile", {
            fields: [field]
        }, {
            params: { access_token: this.token }
        }).then(data => {
            if(data.data.error) return Promise.reject(data.data.error)
            if(!cb) return data.data
            cb(null, data.data)
        }).catch(error => {
            if(!cb) return Promise.reject(error)
            cb(error)
        })
    }

    /**
     * set get started button
     * @param {Function} cb
     * @return {Promise}
     */
    setGetStartedButton(cb){
        return this.setField("get_started", {payload: "GET_STARTED_CONSTANT"}, cb)
    }

    /**
     * remove get started button
     * @param {Function} cb
     * @return {Promise}
     */
    removeGetStartedButton(cb){
        return this.deleteField("get_started", cb)
    }

    /**
     * Send a raw message
     * @param {string} to - recipient ID, if data is an instance of Payload then this value is ignored
     * @param {string|Message|Payload} data
     * @param {Function} cb
     */
    sendMessage(to, data, cb){
        if(typeof data === "string"){
            data = new _sendAPI.Payload(new _sendAPI.Recipient(to), new _sendAPI.Message(data))
        } else if(data instanceof _sendAPI.Message) {
            data = new _sendAPI.Payload(new _sendAPI.Recipient(to), data)
        } else if(!(data instanceof _sendAPI.Payload)){
            if(!cb)
                return Promise.reject(new TypeError("'data' must either be a string or an instance of Message or Payload"))
            else
                return cb(new TypeError("'data' must either be a string or an instance of Message or Payload"))
        }

        return this._axios.post("/me/messages", data, {
            params: { access_token: this.token }
        }).then(data => {
            if(data.data.error) return Promise.reject(new Error(data.data.error))
            if(!cb) return data.data
            cb(null, data.data)
        }).catch(error => {
            if(!cb) return Promise.reject(error)
            cb(error)
        })
    }

    /**
     * The message processing routine. Either invoke this routine with the data received from Facebook or use the middleware
     * which invokes it internally. This routine parses the message and trigger events for each kind of message received
     *
     * @param {object} data
     */
    handleMessage(data){
        if(!data)
            return this.emit("error", new Error("Missing data object"))

        if(!data.object || data.object !== "page")
            return this.emit("error", new Error("Invalid subscription object"))

        // foreach entry
        data.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                // foreach event
                let fb_evt = new FacebookEvent(event)
                this.emit(fb_evt.type, fb_evt, this.sendMessage.bind(this, fb_evt.sender))
            })
        })
    }

    /**
     * Handle webhook validation
     * @param req
     * @param res
     */
    handleVerification(req, res){
        if(!this.verify_token){
            res.status(500)
            return res.send("Missing verification token")
        } else if(req.query['hub.verify_token'] === this.verify_token){
            return res.end(req.query['hub.challenge'])
        } else {
            res.status(403)
            return res.end('Error, invalid validation token')
        }
    }

    /**
     * Get a connect-compatible middleware to handle all requests to the bot
     * @return {function(request, response)}
     */
    middleware(){
        return (req, res) => {
            if(req.method === "GET"){
                return this.handleVerification(req, res)
            } else if(req.method === "POST"){~
                this.handleMessage(req.body)
                return res.end("OK")
            } else {
                res.status(405)
                return res.end("Method not allowed")
            }
        }
    }
}

module.exports = Bot
