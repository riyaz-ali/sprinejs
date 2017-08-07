/**
 * button.js
 *
 * This module contains definitions for different kinds of Buttons like Url, Postback, etc.
 */

/** class representing an abstract button **/
class BaseButton {
    /**
     * create an abstract button definition
     * @param {string} type - The type of button, defined by subclasses
     * @param {string} name - The name/title of button that is shown to user
     */
    constructor(type, name){
        this.type = type
        this.title = name
    }
}

/** class representing a Url button */
class UrlButton extends BaseButton {
    /**
     * create a Url button
     * @param {string} name - The name/title of the button
     * @param {string} url - The URL this button will trigger
     */
    constructor(name, url){
        super('web_url', name)
        this.url = url
    }
}

/** class representing a Postback button */
class PostbackButton extends BaseButton {
    /**
     * create a Postback button
     * @param {string} name - name/title of the button
     * @param {string} payload - the payload that will be passed back to the postback hook when clicked
     */
    constructor(name, payload){
        super('postback', name)
        this.payload = payload
    }
}

/** class representing a Phone button */
class PhoneButton extends BaseButton {
    /**
     * create a Phone button
     * @param {string} name - name/title of the button
     * @param {string} phone - the phone number to initiate the call to
     */
    constructor(name, phone){
        super('postback', name)
        this.payload = phone
    }
}

//- exports
module.exports = {
    BaseButton,
    UrlButton,
    PostbackButton,
    PhoneButton
};