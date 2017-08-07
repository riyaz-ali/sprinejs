/**
 * template.js
 *
 * This module defines the base template class and various sub-template classes for Button, Generic templates etc.
 */

let Attachment = require("./attachment").Attachment
let BaseButton = require("./button").BaseButton

/**
 * class representing a Template
 * Templates are also a king of Attachment only
 */
class Template extends Attachment {
    /**
     * creates a template
     * @param {string} type - the type of the template
     * @param {object} payload - The structured template payload defined by subclasses
     */
    constructor(type, payload){
        payload['template_type'] = type
        super("template", payload)
    }
}

/** class representing a Button template */
class Buttons extends Template {
    /**
     * create a Button Template
     * @param {string} text - The text to display above the buttons
     * @param {Button|Array<Button>|...Button} buttons - Button(s) to add to the template
     */
    constructor(text, ...buttons){
        super("button", {
            text,
            buttons: Buttons.convertToButton(buttons)
        })
    }

    static convertToButton(buttons){
        let ret = [];
        for(let ind=0; ind < buttons.length; ind++){
            if(buttons[ind] instanceof BaseButton){
                ret.push(buttons[ind])
            } else {
                throw new TypeError("'button' element passed must be an instance if BaseButton")
            }
        }
        return ret
    }
}

/** class representing a Generic template */
class GenericTemplate extends Template {
    /**
     * create a generic template
     * @param {Element|Array<Element>|...Element} elements - The element objects to add to the template
     */
    constructor(...elements){
        super("generic", {
            elements: GenericTemplate.convertToElement(elements)
        })
    }

    static convertToElement(elements){
        let ret = [];
        for(let ind=0; ind < elements.length; ind++){
            if(elements[ind] instanceof Element){
                ret.push(elements[ind])
            } else {
                throw new TypeError("'element' object passed must be an instance if Element")
            }
        }
        return ret
    }
}

/** class representing a single element that can be shown with Generic/List template */
class Element {
    /**
     * create an Element
     * @param {string} title - Title of the element
     * @param {string} subtitle - Optional subtitle
     * @param {string} image_url - Optional url to image
     * @param {Array<Button>} buttons - Optional array of buttons
     */
    constructor(title, subtitle, image_url, buttons){
        this.title = title
        this.subtitle = subtitle || ''
        this.image_url = image_url || ''
        this.buttons = buttons || []
    }
}

// Helper builder class
class _Builder {
    /**
     * initialize the builder
     * @param {string} title - Title of the element
     */
    constructor(title){
        this.title = title
    }

    /**
     * sets the subtitle of the the element
     * @param {string} subtitle - Subtitle of the element
     * @return {Element.Builder}
     */
    setSubtitle(subtitle){
        this.subtitle = subtitle
        return this
    }

    /**
     * sets the url to image to use
     * @param {string} url - URL to image
     * @return {Element.Builder}
     */
    setImage(url){
        this.image_url = url
        return this
    }

    /**
     * Add a button to this element
     * @param {BaseButton} button - A single button to add to this element
     * @return {Element.Builder}
     */
    addButton(button){
        this.buttons = this.buttons || []
        this.buttons.push(button)
        return this
    }

    /**
     * Build the Element object
     * @return {Element}
     */
    build(){
        return new Element(
            this.title,
            this.subtitle,
            this.image_url,
            this.buttons
        )
    }
}

// static inner class
Element.Builder = _Builder

//- exports
module.exports = {
    Template,
    Buttons,
    GenericTemplate,
    Element
}