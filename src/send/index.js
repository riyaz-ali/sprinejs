/**
 * submodule containing classes for easily creating Message- and Templated- payloads to send
 * to Facebook's Sender API (https://graph.facebook.com/v2.6/me/messages)
 *
 * see https://developers.facebook.com/docs/messenger-platform/send-api-reference for object reference
 */

let _attachment = require("./attachment")
let _template   = require("./template")
let _quick_reply= require("./quick-reply")
let _button     = require("./button")
let _base       = require("./base")

module.exports = Object.assign({}, _attachment, _template, _quick_reply, _button, _base)