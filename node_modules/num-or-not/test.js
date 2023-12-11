import test from 'ava';
import isNum from './index.js';


const validNumbers = [0b0, 6e3, 12e-2, 0xFF, 4e1, 0, 0.0, 0.5, -0.5, -5.5, 99, 100.987, 0o12, 0o144, 0O144, +1, +3.14, +37, +5, 0.6931471, Number.MAX_VALUE, Number.MIN_VALUE];
const validStrings = ['0b0','1,2,3', '6e3', '12e-2', '0xFF', '4e1', '34,56', '100,000.45', '123,456,789', '123.456.789', '0', '0.0', '0.5', '-0.5', '-5.5', '99', '100.987', '0o12', '0o144', '0O144', '0144', '0.0', '0x0', '0e+5', '000', '0.0e-5', '0.0E5'];
const castedValues = [ +'', +[], +[0], +[""], +true, +false, +null, +String(1), +new Array(''), +new Array(0), +Boolean(true), +new Date, +new Date() ];

const valuesToPass = [...validNumbers, ...validStrings, ...castedValues];

const valuesToFail = [
    +new RegExp('foo'),
    new RegExp('foo'),
    Boolean(true),
    new Array(''),
    +new Array(2),
    +String('foo'),
    String("foo"),
    String("xyz"),
    new Date(),
    Math.tan(),
    'undefined',
    +undefined,
    undefined,
    +Infinity,
    Infinity,
    +[1, 2, 4],
    [1, 2, 3],
    +/foo/,
    /foo/,
    'xyz',
    'true',
    'false',
    'null',
    +'5b',
    '5b',
    +{x:1},
    {x:1}
    +{},
    {},
    true,
    false,
    null,
    +NaN,
    NaN,
    [],
    ''
];


test.cb('valid numbers should return true', t => {
    t.plan(valuesToPass.length);

    for (let i in valuesToPass){
        const value = valuesToPass[i];
        t.is(isNum(value), true);
    }

    t.end();

});

test.cb('invalid numbers should return false', t => {
    t.plan(valuesToFail.length);

    for (let i in valuesToFail){
        const value = valuesToFail[i];
        t.is(isNum(value), false);
    }

    t.end();
});

test('should ignore whitespace chars', t => {
    t.is(isNum('      '), false);
    t.is(isNum('\r\n\t'), false);
    t.is(isNum('\r\n\t42'), true);
    t.is(isNum(' 42 '), true);
    t.is(isNum('   0xFF    '), true);
});

