/**
 * attachment.js
 *
 * This module defines the base :Attachment: class and the specialized attachment classes
 */


/** class representing an abstract attachment */
class Attachment {
    /**
     * creates an attachment
     * @param {string} type - The type of Attachment
     * @param {object} payload - The 'payload' object whose shape is defined by the type of attachment
     */
    constructor(type, payload){
        this.type = type
        this.payload = payload
    }
}

/** class representing an Audio attachment */
class AudioAttachment extends Attachment {
    /**
     * creates an Audio attachment
     * @param {string} url - The url to the audio file
     */
    constructor(url){
        super("audio", { url })
    }
}

/** class representing a File attachment */
class FileAttachment extends Attachment {
    /**
     * creates a File attachment
     * @param {string} url - The url to the file to send
     */
    constructor(url){
        super("file", { url })
    }
}

/** class representing an Image attachment */
class ImageAttachment extends Attachment {
    /**
     * creates an Image attachment
     * @param {string} url - The url to the image
     */
    constructor(url){
        super("image", { url })
    }
}

/** class representing a Video attachment */
class VideoAttachment extends Attachment {
    /**
     * creates a Video attachment
     * @param {string} url - The url to the video
     */
    constructor(url) {
        super("video", {url})
    }
}

//- exports
module.exports = {
    Attachment,
    AudioAttachment,
    FileAttachment,
    ImageAttachment,
    VideoAttachment
};