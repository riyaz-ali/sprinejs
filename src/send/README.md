# Sprine Send API
This module contains class and object definitions making up the Send API.

The classes are essentially just Plain-old JavaScript structures to provide
some semantic definition and add a bit of syntactic-sugar over the more
traditional object structure and reduces chances of errors occurring due to
invalid object structure.

## Reference

```js
class Attachment
```

Abstract attachment class. This is the base class for all other attachment type.

**Properties**
* `type {string}`: String representing the type of this attachment.
* `payload {object}`: Object payload of this attachment.

**Methods**
* `constructor(type: String, payload: Object)`

```js
class AudioAttachment extends Attachment
```

Class representing a single [Audio attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/audio-attachment).

**Methods**
* `constructor(url: String)`

```js
class FileAttachment extends Attachment
```

Class representing a single [File attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/file-attachment)

**Methods**
* `constructor(url: String)`

```js
class ImageAttachment extends Attachment
```

Class representing a single [Image attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/image-attachment)

**Methods**
* `constructor(url: String)`

```js
class VideoAttachment extends Attachment
```

Class representing a single [Video attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/video-attachment)

**Methods**
* `constructor(url: String)`


```js
class Template extends Attachment
```

Abstract base class representing a [Template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates). Structurally, Templates are also a kind of Attachment only.

**Methods**
* `constructor(type: String, payload: Object)`

```js
class Buttons extends Template
```

Class representing a [Button Template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

**Methods**
* `constructor(text: String, ...buttons: BaseButton)`

```js
class GenericTemplate extends Template
```

Class representing a [Generic Template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

**Methods**
* `constructor(..elements: Element)`


```js
class BaseButton
```

Abstract base class for buttons.

**Properties**
* `type {string}`: Type of the button
* `title {string}`: Title/name of the button

```js
class UrlButton extends BaseButton
```

Class representing a [URL Button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/url-button)

**Methods**
* `constructor(name: String, url: String)`

```js
class PostbackButton extends BaseButton
```

Class representing a [Postback Button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/postback-button)

**Methods**
* `constructor(name: String, payload: String)`

```js
class PhoneButton extends BaseButton
```

Class representing a [Phone Button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/call-button)

**Methods**
* `constructor(name: String, phone: String)`


```js
class QuickReply
```

Class representing a [Quick Reply](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies)

**Methods**
* `constructor(type: String, title: String, payload: String [, image: String])`

**Static Methods**
* `text(title: String, payload: String [, image: String])`- create a text quick reply
* `location()` - create a location quick reply to ask user for location


```js
class Recipient
```

Class representing a Recipient of the message

**Properties**
* `id {string}` - Page-scoped ID of the recipient

**Methods**
* `constructor(id: String)`

```js
class Message
```

Class representing a single Message to send

**Methods**
* `constructor(message: <String|Attachment> [, quick_replies: Array<QuickReply> [, metadata: String]])`


```js
class Payload
```

Class representing a single payload object that is POSTed to Facebook's endpoint

**Methods**
* `constructor(recipient: Recipient, message: Message, action: String, notification: String)` -
message and action are mutually exclusive. Either one of them should be set but not both.