# Minify [![License][LicenseIMGURL]][LicenseURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![NPM version][NPMIMGURL]][NPMURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/minify.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/minify/actions
[BuildStatusIMGURL]: https://github.com/coderaiser/minify/workflows/CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPM_INFO_IMG]: https://nodei.co/npm/minify.png?stars
[NPMURL]: http://npmjs.org/package/minify
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/minify?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/minify/badge.svg?branch=master&service=github

[Minify](http://coderaiser.github.io/minify "Minify") - a minifier of js, css, html and img files.
To use `minify` as middleware try [Mollify](https://github.com/coderaiser/node-mollify "Mollify").

## Install

```
npm i minify -g
```

## How to use?

### CLI

The bash command below creates a code snippet saved as `hello.js`.

Simply copy + paste the code starting with cat, including the EOT on the last line, and press <enter>.

```sh
$ cat << EOT > hello.js
const hello = 'world';

for (let i = 0; i < hello.length; i++) {
    console.log(hello[i]);
}
EOT
```

Use the command `minify` followed by the path to and name of the js file intended to be minified. This will minify the code and output it to the screen.

```sh
$ minify hello.js
const hello="world";for(let l=0;l<hello.length;l++)console.log(hello[l]);
```

You can capture the output with the following:

```sh
$ minify hello.js > hello.min.js
```

`Minify` can be used with `async-await` and [try-to-catch](https://github.com/coderaiser/try-to-catch):

```js
import {minify} from 'minify';
import tryToCatch from 'try-to-catch';
const options = {
    html: {
        removeAttributeQuotes: false,
        removeOptionalTags: false,
    },
};

const [error, data] = await tryToCatch(minify, './client.js', options);

if (error)
    return console.error(error.message);

console.log(data);
```

## Options

For cli use these options can be provided in a JSON file named `.minify.json` like so:

```json
{
    "html": {
        "removeAttributeQuotes": false
    },
    "css": {
        "compatibility": "*"
    },
    "js": {
        "ecma": 5
    },
    "img": {
        "maxSize": 4096
    }
}
```

`minify` walking up parent directories to locate and read it’s configuration file `.minify.json`.

Full documentation for options that each file type accepts can be found on the pages of the libraries used by minify to process the files:

- HTML: https://github.com/kangax/html-minifier
- CSS: https://github.com/jakubpawlowicz/clean-css
- JS: https://github.com/terser/terser
- IMG: https://github.com/Filirom1/css-base64-images

Minify sets a few defaults for HTML that may differ from the base `html-minifier` settings:

```json
{
    "removeComments": true,
    "removeCommentsFromCDATA": true,
    "removeCDATASectionsFromCDATA": true,
    "collapseWhitespace": true,
    "collapseBooleanAttributes": true,
    "removeAttributeQuotes": true,
    "removeRedundantAttributes": true,
    "useShortDoctype": true,
    "removeEmptyAttributes": true,
    "removeEmptyElements": false,
    "removeOptionalTags": true,
    "removeScriptTypeAttributes": true,
    "removeStyleLinkTypeAttributes": true,
    "minifyJS": true,
    "minifyCSS": true
}
```

## License

MIT
