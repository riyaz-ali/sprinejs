/**
 * A custom Facebook event wrapper to provide shorthand utility functions to work with Facebook event data
 */
class FacebookEvent {
    /**
     * Create a Facebook event object from data received from Facebook
     * @param {object} evt
     */
    constructor(evt) {
        this.__store = evt
    }

    get sender(){
        return this.__store.sender.id
    }

    get timestamp(){
        return new Date(this.__store.timestamp)
    }

    get type(){
        if(this.__store.message)
            if(this.__store.message.is_echo)
                return "echo"
            else
                return "message"
        else if(this.__store.postback)
            return "postback"
        else if(this.__store.delivery)
            return "delivery"
        else if(this.__store.read)
            return "read"
        else if(this.__store.optin)
            return "authentication"
        else if(this.__store.referral)
            return "referral"
        else if(this.__store.account_linking && this.__store.account_linking.status)
            if(this.__store.account_linking.status === "linked")
                return "account-linked"
            else
                return "account-unlinked"
        else
            return "unknown"
    }

    get data(){
        if(this.type === "unknown")
            return this.__store
        else if(this.type === "echo" || this.type === "message")
            return this.__store.message
        else if(this.type.startsWith("account"))
            return this.__store.account_linking
        else if(this.type === "authentication")
            return this.__store.optin
        else
            return this.__store[this.type]
    }
}

module.exports = FacebookEvent