# nhentai-pdf

## I don't own this project. This is just a fork of [nhentai-pdf](https://www.npmjs.com/package/nhentai-pdf)

### NPM package to be used for getting the holy numbers in pdf 🌚 Welcome to the Darkness

## Methods Availables:

### validate:

    it checks if the doujin exists.
    returns boolean

### fetch:

    it fetches the doujin information.
    returns a promise

### save:

    it sends the buffer as a pdf.
    returns a promise

Usage:

```javascript
const { Doujin } = require('@shineiichijo/nhentai-pdf')
const doujin = new Doujin('https://nhentai.net/g/366327/')
doujin.validate().then(console.log)
doujin.fetch().then(console.log)
doujin.save().then(console.log)
```
