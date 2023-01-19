# Angka-terbilang-js [![NPM Version](https://img.shields.io/npm/v/@develoka/angka-terbilang-js.svg)](https://www.npmjs.com/package/@develoka/angka-terbilang-js) [![Minified Size](https://img.shields.io/bundlephobia/min/@develoka/angka-terbilang-js.svg)](https://www.npmjs.com/package/@develoka/angka-terbilang-js)
Mengkonversi angka ke dalam bilangan bahasa Indonesia. Misalnya dari `123`, menjadi `seratus dua puluh tiga`.

## Demo

[Link Demo](http://code.bakasyntax.com/gist/e41efb58b4b7fae2bfdfd0a1b0219ed7?default-pans=html,js,output)

## Instalasi

```
npm install @develoka/angka-terbilang-js
```

kemudian

```js
import angkaTerbilang from '@develoka/angka-terbilang-js'; // if using import
const angkaTerbilang = require('@develoka/angka-terbilang-js'); // if using require
```

atau langsung dari web browser

```
<script src="https://unpkg.com/@develoka/angka-terbilang-js/index.min.js">
```

## Penggunaan

```js
console.log(angkaTerbilang(777666555));
// tujuh ratus tujuh puluh tujuh juta enam ratus enam puluh enam ribu lima ratus lima puluh lima
console.log(angkaTerbilang('1002109381290'));
// satu triliun dua milyar seratus sembilan juta tiga ratus delapan puluh satu ribu dua ratus sembilan puluh
console.log(angkaTerbilang('3148112838011192391239213'));
// tiga septiliun seratus empat puluh delapan sextiliun seratus dua belas quintiliun delapan ratus tiga puluh delapan quadriliun sebelas triliun seratus sembilan puluh dua milyar tiga ratus sembilan puluh satu juta dua ratus tiga puluh sembilan ribu dua ratus tiga belas
```

## Fitur

### A. Mendukung konversi angka di belakang koma 

Default simbol koma adalah `"."`. Untuk mengubah gunakan parameter `{ decimal: ','}`.

```js
console.log(angkaTerbilang(123.23));
// seratus dua puluh tiga koma dua tiga
console.log(angkaTerbilang('123.23'));
// seratus dua puluh tiga koma dua tiga
console.log(angkaTerbilang('123,23', {decimal: ','}));
// seratus dua puluh tiga koma dua tiga
```

### B. Mendukung bilangan besar, hingga 10<sup>63</sup>.

| Angka           | Satuan           |
|:---------------:|:----------------:|
| 10<sup>1</sup>  | puluhan          |
| 10<sup>2</sup>  | ratusan          |
| 10<sup>3</sup>  | ribu             |
| 10<sup>6</sup>  | juta             |
| 10<sup>9</sup>  | milyar           |
| 10<sup>12</sup> | triliun          |
| 10<sup>15</sup> | quadriliun       |
| 10<sup>18</sup> | quintiliun       |
| 10<sup>21</sup> | sextiliun        |
| 10<sup>24</sup> | septiliun        |
| 10<sup>27</sup> | oktiliun         |
| 10<sup>30</sup> | noniliun         |
| 10<sup>33</sup> | desiliun         |
| 10<sup>36</sup> | undesiliun       |
| 10<sup>39</sup> | duodesiliun      |
| 10<sup>42</sup> | tredesiliun      |
| 10<sup>45</sup> | quattuordesiliun |
| 10<sup>48</sup> | quindesiliun     |
| 10<sup>51</sup> | sexdesiliun      |
| 10<sup>54</sup> | septendesiliun   |
| 10<sup>57</sup> | oktodesiliun     |
| 10<sup>60</sup> | novemdesiliun    |
| 10<sup>63</sup> | vigintiliun      |

## Testing

Testing menggunakan [jest](https://jestjs.io/). Lihat [file tests](https://github.com/develoka/angka-terbilang-js/blob/master/test/index.test.js).

```
npm install
npm run test
```

## Development

Edit `index.js` kemudian jalankan perintah:

```
npm run build
```

## Benchmark / Uji Performa

Benchmark dilakukan terhadap 2 package serupa lainnya. Dengan mengkonversi angka dengan besaran **ratusan ribu**, **ratusan juta**, **ratusan milyar**, **ratusan triliun**.

| Package                          | Angka Ratusan Ribu      | Angka Ratusan Juta      | Angka Ratusan Milyar    | Angka Ratusan Triliun   |
|----------------------------------|-------------------|-------------------|-------------------|-------------------|
| [@develoka/angka-terbilang-js](https://github.com/develoka/angka-terbilang-js)     | 3,033,891 ops/sec | 2,304,711 ops/sec | 1,748,600 ops/sec | 1,339,721 ops/sec |
| [dikyarga/angka-menjadi-terbilang](https://github.com/dikyarga/angka-menjadi-terbilang) | 116,710 ops/sec   | 103,075 ops/sec   | 85,881 ops/sec    | 77,056 ops/sec    |
| [BosNaufal/terbilang-js](https://github.com/BosNaufal/terbilang-js)           | 188,457 ops/sec   | 130,263 ops/sec   | 80,033 ops/sec    | 54,130 ops/sec    |
| [DimasKiddo/angka-terbilang-nodejs](https://github.com/dimaskiddo/angka-terbilang-nodejs)           | 1,843,987 ops/sec   | 1,791,951 ops/sec   | 1,327,440 ops/sec    | 1,050,543 ops/sec    |
| [rimara14/terbilang](https://github.com/rimara14/terbilang)           | 423,788 ops/sec   | 291,578 ops/sec   | 170,460 ops/sec    | 1,103,812 ops/sec    |


Detail benchmark dapat dilihat pada halaman [repository benchmark](https://github.com/develoka/angka-terbilang-js-benchmark).
