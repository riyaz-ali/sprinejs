# Sprine

A Node.js client for the [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform). The API is largely influenced by [messenger-bot](https://github.com/remixz/messenger-bot).

## Installation
[TODO] : Add an NPM-Package
```bash
npm install git+https://git@github.com/riyaz-ali/sprine.git
```

## Example
```js
// express (or any connect-compatible app)
const app = require("express")()

// sprine bot
const Bot = require("sprine").Bot
const send = require("sprine").send  //- module for Sender API

let bot = new Bot({
    token: "PAGE_TOKEN",
    verify: "VERIFICATION_TOKEN"
})

/** subscribe to bot events */

//- error
bot.on("error", err => console.error(err))

//- message
bot.on("message", (event, reply) => {
    // event is an instance of FacebookEvent
    console.log("[%s]: %s", event.sender, event.timestamp)

    // send an image attachment
    let msg0 = new send.Message(
                new send.ImageAttachment("http://example.com/welcome.png")
            )

    // send quick reply template
    let msg1 = new send.Message(
                "Red or Blue?",
                [send.QuickReply.text("Red", "COLOR_RED"),
                 send.QuickReply.text("Blue", "COLOR_BLUE")]
            )

    // ask for location
    let msg2 = new send.Message(
                "Weather! but for where?",
                send.QuickReply.location()
           )

    //- Reply to the message

    // 1. Simple text
    reply("Hello there! I got your message")

    // 2. Composed Message
    reply(msg1) // or msg2, msg3, etc.

    // 3. Or a complete Payload
    let payload = new send.Payload(
            new send.Recipient(event.sender),
            msg2,
            null, // sender actions
            send.Notification.SILENT  // notification type
        )

    reply(payload).then(resp => console.log(resp)
})


// add a middleare to your app to handle Messenger webhook calls
app.use("/facebook", bot.middleware())

// run
app.listen(8080)
```

## Reference

```
class Bot extends EventEmitter
```

The base class the user mainly interacts with. This class provides functions and events
that helps the user tap into events and messages received from Facebook and respond to them.

**`let bot = new Bot(options)`**

Returns a new *Bot* instance

`options` - Object
* `token {string}` - Your Page Access Token. Required.
* `verify {string}` - Verification token for one-time setup. Required, if you want the bot to handle verification for you.
* `subscribe {boolean}` - Subscribe App to the Page on initialization. Optional.

**`Bot#middleware()`**

Returns a connect-compatible middleware function.

**`Bot#sendMessage(to, data [, callback])`**

Send a message *data* to target *to*. Returns a promise.
Also see [Facebook Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference)
* `to {string}` - Page-scoped ID of the intended recipient. Required, if data is not an instance of Payload. If data is an instance of Payload then this is ignored.
* `data {string|Message|Payload}` - The message to send. Can be a string/text, a Message or a Payload. Required.

**`Bot#handleMessage(data)`**

The message processing routine. Either invoke this routine with the data received from Facebook or use the middleware
which invokes it internally. This routine parses the message and trigger events for each kind of message received.

* `data {object}` - Data received from Facebook. Required.

**`Bot#handleVerification(request, response)`**

Handle webhook validation request.

* `request` - A connect-compatible request object.
* `response` - A connect-compatible response object.

**`Bot#subscribe()`**

Subscribes the App to Page programmatically. Returns a promise.

**`Bot#getProfile(id [, callback])`**

Get the [User's Profile](https://developers.facebook.com/docs/messenger-platform/user-profile). Returns a promise which resolves either to a User Profile object or an  empty object depending on whether the profile is available or not.
* `id {string}` - Page-scoped ID of the user. Required. Usually, this is the `event.sender` property of the concerned message.

**`Bot#setField(field, payload [, callback])`**

Sets a field for the [Messenger Profile API](https://developers.facebook.com/docs/messenger-platform/messenger-profile)
* `field {string}` - Name of the field. Required.
* `payload {object}` - Object payload to set. Required.

**`Bot#deleteField(field [, callback])`**

Deletes a field for the [Messenger Profile API](https://developers.facebook.com/docs/messenger-platform/messenger-profile)

* `field {string}`: Name of the field to delete

**`Bot#setGetStartedButton([callback])`**

Shorthand function to enable the [Get Started Button](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

**`Bot#removeGetStartedButton([callback])`**

Shorthand function to disable the [Get Started Button](https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button)

##### Events
Every event, except the `error` event, receives a `FacebookEvent` object and a `reply(data [, callback])` function that's an alias to `Bot#sendMessage(to, data [, callback])` with a bound ID.

List of events:

1. **message**: fired when a [message](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message) is received.
2. **echo**: fired when an [echo](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo) is received.
3. **postback**: fired when a [postback](https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback) is received.
4. **delivery**: fired when a [delivery](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered) receipt is received.
5. **read**: Fired when a [read](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read) receipt is received.
6. **authentication**: Fired when an [optin](https://developers.facebook.com/docs/messenger-platform/webhook-reference/optins) is received.
7. **referral**: Fired when a [referral](https://developers.facebook.com/docs/messenger-platform/webhook-reference/referral) is received.
8. **account-linked**: Fired when an [Account Linking](https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking) event with status `linked` is received.
9. **account-unlinked**: Fired when an [Account Linking](https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking) event with status `unlinked` is received.
10. **unknown**: Fired when an unknown event is received.


```
class FacebookEvent
```

The FacebookEvent class. The instance of this class is passed to the event listeners when an event is received.

**`FacebookEvent#sender`**

A getter-property to access the event's sender id.

**`FacebookEvent#timestamp`**

A getter-property to access the event's timestamp.

**`FacebookEvent#type`**

A getter-property to get the event's type.

**`FacebookEvent#data`**

A getter-property to get the data object associated with the event. The shape of this object depends on the type of event, see [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhook-reference) for more details.


## Send API
For a reference to Send API, check the [documentation here](src/send/README.md)