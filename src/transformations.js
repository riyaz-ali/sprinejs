const FacebookEvent = require("./FacebookEvent")

//- common middleware transformations
module.exports = transformations = [
    // 1. get a raw message and extract it's type
    function(next, raw){
        // TODO: Add transformation handles to convert raw message types into appropriate Event instances
        // for now just using the base FacebookEvent class
        next(new FacebookEvent(raw))
    }
]