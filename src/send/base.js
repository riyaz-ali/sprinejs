/**
 * This module contains classes defining the base Message object, the Recipient object and other fields constituting the
 * final Payload that is sent to the Sender API.
 */

let Attachment = require("./attachment").Attachment
let QuickReply = require("./quick-reply").QuickReply


/**
 * class representing a single Payload to 'post' to the Sender API endpoint
 * A single Payload is composed of a Recipient and Message or Sender Action and may optionally include a Notification type
 */
class Payload {
    /**
     * create a single Payload
     * @param {Recipient} recipient
     * @param {Message} message - message or action must be set
     * @param {Action} action - message or action must be set
     * @param {Notification} notification
     */
    constructor(recipient, message, action, notification){
        if(!recipient || !(recipient instanceof  Recipient)){
            throw new TypeError("'recipient' must be an instance of Recipient [found " + typeof recipient + "]")
        } else {
            this.recipient = recipient
        }

        if(message && !action){
            if(message instanceof Message) {
                this.message = message
            } else if(typeof message === "string"){
                this.sender_action = message
            } else {
                throw new TypeError("'message' must be an instance of Message [found " + typeof message + "]")
            }
        } else if(action && !message){
            this.sender_action = action
        } else {
            // either both are set or unset and that's an error
            throw new TypeError("Either 'message' or 'action' must be set")
        }

        if(notification){
            this.notification_type = notification
        }
    }

    /**
     * convert the payload to a json string
     * @return {string}
     */
    json(){
        return JSON.stringify(this)
    }
}

/** class representing a single Recipient */
class Recipient {
    /**
     * create a Recipient of the payload
     * @param {string} id - Page-scoped user ID of the recipient
     */
    constructor(id){
        this.id = id
    }
}

/**
 * class representing a Message
 * A single message may contain either a 'text' or 'attachment' field, an array of quick-replies
 * and some arbitrary metadata that is sent back as a message-echo event from Messenger API
 */
class Message {
    /**
     * create a single Message object
     * @param {string|Attachment} message - Either a string for text message or an instance of Attachment
     * @param {Array<QuickReply>} quick_replies - An array of QuickReply objects
     * @param {string} metadata - some arbitrary string payload to send
     */
    constructor(message, quick_replies, metadata){
        if(typeof message === 'string'){
            this.text = message
        } else if(message instanceof Attachment){
            this.attachment = message
        } else {
            throw new TypeError("'message' should either me a String or an instance of Attachment [found " + typeof message + "]")
        }

        if(quick_replies && Array.isArray(quick_replies)){
            this.quick_replies = quick_replies
        } else if(quick_replies instanceof QuickReply){
            this.quick_replies = [quick_replies]
        } else if(quick_replies) {
            // just log an error for, don't throw as quick_replies is not a required field
            console.error(new TypeError("'quick_replies' must be an Array of QuickReply or an instance of QuickReply [found " + typeof quick_replies + "]"))
        }

        if(metadata && typeof metadata === "string"){
            this.metadata = metadata
        } else if(metadata) {
            console.error(new TypeError("'metadata' must be a String [found " + typeof metadata + "]"))
        }
    }
}

/** Enum representing different SenderActions */
let Action = Object.freeze({
    MARK_SEEN: "mark_seen",
    TYPING_ON: "typing_on",
    TYPING_OFF:"typing_off"
});

/** Enum representing different Notification types */
let Notification = Object.freeze({
    REGULAR: "REGULAR",
    SILENT:  "SILENT_PUSH",
    NO_PUSH: "NO_PUSH"
});

//- exports
module.exports = {
    Payload,
    Recipient,
    Message,
    Action,
    Notification
};