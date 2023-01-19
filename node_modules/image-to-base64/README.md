# image-to-base64
Generate a base64 code from an image through a URL or a path.
 
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/renanbastos93/image-to-base64.svg?branch=master)](https://travis-ci.org/renanbastos93/image-to-base64)
![Tests](https://github.com/renanbastos93/image-to-base64/workflows/Tests/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/319a6e0b35474cf3ada5b0894e959b65)](https://www.codacy.com/app/renanbastos93/image-to-base64?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=renanbastos93/image-to-base64&amp;utm_campaign=Badge_Grade)
<a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>

[npm-image]: https://img.shields.io/npm/v/image-to-base64.svg
[npm-url]: https://npmjs.org/package/image-to-base64
[downloads-image]: https://img.shields.io/npm/dm/image-to-base64.svg
[downloads-url]: https://npmjs.org/package/image-to-base64

## About
It's a thing you can use in many situations, for example you can just save the base64 string in your database and increment it in the front-end with the `<img>` tag in HTML.

## Getting Started
Installation:
```bash
npm i -S image-to-base64
```
Code Example:
```js
const imageToBase64 = require('image-to-base64');
//or
//import imageToBase64 from 'image-to-base64/browser';

imageToBase64("path/to/file.jpg") // Path to the image
    .then(
        (response) => {
            console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )
```
Remember that you can also use an image URL as a parameter.

Code Example:
```js
imageToBase64("https://whatever-image/") // Image URL
    .then(
        (response) => {
            console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )
```

#### Browser Usage
You can import image-to-base64 using the `<script>` tag in HTML.

Code Example:
```html
<script src="node_modules/image-to-base64/image-to-base64.min.js"></script>
```
Now you can use the module normally as in the JS examples above, but you can only use a URL and not a path. 

### LICENSE
[MIT](https://opensource.org/licenses/MIT) © 2017 RENAN.BASTOS
