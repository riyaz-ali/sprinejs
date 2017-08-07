/**
 * SprineJS - A Javascript client API for creating Facebook Messenger bots in node
 *
 */

const send = require("./src/send")
const Bot  = require("./src/bot")
const FacebookEvent = require("./src/FacebookEvent")

module.exports = {
    send,
    Bot,
    FacebookEvent
}