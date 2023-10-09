const angkaTerbilang = require("../");

test('nol', () => {
    expect(angkaTerbilang('0')).toBe("nol");
});

test('belasan', () => {
    expect(angkaTerbilang('11000')).toBe("sebelas ribu");
    expect(angkaTerbilang('10000')).toBe("sepuluh ribu");
    expect(angkaTerbilang('11001')).toBe("sebelas ribu satu");
    expect(angkaTerbilang('11011')).toBe("sebelas ribu sebelas");
    expect(angkaTerbilang('1011021')).toBe("satu juta sebelas ribu dua puluh satu");
    expect(angkaTerbilang('190118')).toBe("seratus sembilan puluh ribu seratus delapan belas");
    expect(angkaTerbilang('16915')).toBe("enam belas ribu sembilan ratus lima belas");
    expect(angkaTerbilang('1017911')).toBe("satu juta tujuh belas ribu sembilan ratus sebelas");
    expect(angkaTerbilang('110011')).toBe("seratus sepuluh ribu sebelas");
});

test('seribu-saturibu', () => {
    expect(angkaTerbilang('1000')).toBe("seribu");
    expect(angkaTerbilang('21000')).toBe("dua puluh satu ribu");
    expect(angkaTerbilang('201000')).toBe("dua ratus satu ribu");
    expect(angkaTerbilang('2001000')).toBe("dua juta seribu");
    expect(angkaTerbilang('20001000')).toBe("dua puluh juta seribu");
    expect(angkaTerbilang('200001000')).toBe("dua ratus juta seribu");
});

test('jutaan', () => {
    expect(angkaTerbilang('1000000')).toBe("satu juta");
    expect(angkaTerbilang('1001000')).toBe("satu juta seribu");
    expect(angkaTerbilang('1011000')).toBe("satu juta sebelas ribu");
    expect(angkaTerbilang('131021111')).toBe("seratus tiga puluh satu juta dua puluh satu ribu seratus sebelas");
    expect(angkaTerbilang('11021111')).toBe("sebelas juta dua puluh satu ribu seratus sebelas");
    expect(angkaTerbilang('212121212')).toBe("dua ratus dua belas juta seratus dua puluh satu ribu dua ratus dua belas");
    expect(angkaTerbilang('121212121')).toBe("seratus dua puluh satu juta dua ratus dua belas ribu seratus dua puluh satu");
});

test('big-number', () => {
    expect(angkaTerbilang('1000000001000000001')).toBe("satu quintiliun satu milyar satu");
    expect(angkaTerbilang('1000200001000000001')).toBe("satu quintiliun dua ratus triliun satu milyar satu");
    expect(angkaTerbilang('9885888242291758493761')).toBe("sembilan sextiliun delapan ratus delapan puluh lima quintiliun delapan ratus delapan puluh delapan quadriliun dua ratus empat puluh dua triliun dua ratus sembilan puluh satu milyar tujuh ratus lima puluh delapan juta empat ratus sembilan puluh tiga ribu tujuh ratus enam puluh satu");
    expect(angkaTerbilang('700960052123456600111229373574356912338626529885888242291758493761')).toBe("tujuh ratus vigintiliun sembilan ratus enam puluh novemdesiliun lima puluh dua oktodesiliun seratus dua puluh tiga septendesiliun empat ratus lima puluh enam sexdesiliun enam ratus quindesiliun seratus sebelas quattuordesiliun dua ratus dua puluh sembilan tredesiliun tiga ratus tujuh puluh tiga duodesiliun lima ratus tujuh puluh empat undesiliun tiga ratus lima puluh enam desiliun sembilan ratus dua belas noniliun tiga ratus tiga puluh delapan oktiliun enam ratus dua puluh enam septiliun lima ratus dua puluh sembilan sextiliun delapan ratus delapan puluh lima quintiliun delapan ratus delapan puluh delapan quadriliun dua ratus empat puluh dua triliun dua ratus sembilan puluh satu milyar tujuh ratus lima puluh delapan juta empat ratus sembilan puluh tiga ribu tujuh ratus enam puluh satu");
});

test('all-zero', () => {
    expect(angkaTerbilang('1')).toBe("satu");
    expect(angkaTerbilang('10')).toBe("sepuluh");
    expect(angkaTerbilang('100')).toBe("seratus");
    expect(angkaTerbilang('1000')).toBe("seribu");
    expect(angkaTerbilang('10000')).toBe("sepuluh ribu");
    expect(angkaTerbilang('100000')).toBe("seratus ribu");
    expect(angkaTerbilang('1000000')).toBe("satu juta");
    expect(angkaTerbilang('10000000')).toBe("sepuluh juta");
    expect(angkaTerbilang('100000000')).toBe("seratus juta");
    expect(angkaTerbilang('1000000000')).toBe("satu milyar");
    expect(angkaTerbilang('10000000000')).toBe("sepuluh milyar");
    expect(angkaTerbilang('100000000000')).toBe("seratus milyar");
    expect(angkaTerbilang('1000000000000')).toBe("satu triliun");
    expect(angkaTerbilang('10000000000000')).toBe("sepuluh triliun");
    expect(angkaTerbilang('100000000000000')).toBe("seratus triliun");
    expect(angkaTerbilang('1000000000000000')).toBe("satu quadriliun");
    expect(angkaTerbilang('10000000000000000')).toBe("sepuluh quadriliun");
    expect(angkaTerbilang('100000000000000000')).toBe("seratus quadriliun");
    expect(angkaTerbilang('1000000000000000000')).toBe("satu quintiliun");
    expect(angkaTerbilang('10000000000000000000')).toBe("sepuluh quintiliun");
    expect(angkaTerbilang('100000000000000000000')).toBe("seratus quintiliun");
});

test('koma-number', () => {
    expect(angkaTerbilang('123.12')).toBe("seratus dua puluh tiga koma satu dua");
    expect(angkaTerbilang('543.49')).toBe("lima ratus empat puluh tiga koma empat sembilan");
    expect(angkaTerbilang('513.06')).toBe("lima ratus tiga belas koma nol enam");
    expect(angkaTerbilang('123,123', {decimal: ','})).toBe("seratus dua puluh tiga koma satu dua tiga");
    expect(angkaTerbilang('543,40', {decimal: ','})).toBe("lima ratus empat puluh tiga koma empat nol");
    expect(angkaTerbilang('513,06', {decimal: ','})).toBe("lima ratus tiga belas koma nol enam");
});