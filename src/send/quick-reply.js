/**
 * This module contains definitions for Quick Reply messages
 */

/** class representing a quick reply message */
class QuickReply {
    /**
     * create a Quick reply message
     * @param {string} type  - Type of quick reply, must be one of {text, location}
     * @param {string} title - Title of the quick reply in case type is 'text'
     * @param {string} payload - payload to be delivered when quick reply is clicked in case type is 'text'
     * @param {string} image - url to image in case type is 'text'
     */
    constructor(type, title, payload, image){
        this.content_type = type
        this.title = title
        this.payload = payload
        this.image_url = image
    }

    /**
     * create a new QuickReply of type text
     * @param {string} title - Title of the quick reply in case type is 'text'
     * @param {string} payload - payload to be delivered when quick reply is clicked in case type is 'text'
     * @param {string} image - url to image in case type is 'text'
     * @return {QuickReply}
     */
    static text(title, payload, image){
        return new QuickReply('text', title, payload, image)
    }

    /**
     * create a new QuickReply of type 'location'
     * @return {QuickReply}
     */
    static location(){
        return new QuickReply('location')
    }
}

module.exports = {
    QuickReply
};