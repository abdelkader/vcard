var vCard = require('../lib/vcard');

describe('vCard.parse', function () {
    it('Should parse encoded', function () {
        var raw = 'BEGIN:VCARD\r\nFN;ENCODING=QUOTED-PRINTABLE:Ren=E9\r\nEND:VCARD',
            card = vCard.parse(raw);

        expect(card.fn[0].value).toEqual("René");
    });

    it('Should parse multi-line values', function () {
        var raw = 'BEGIN:VCARD\r\nFN:Jean-Christophe de la Haute Pierre \r\n Roche-Perrin\r\nEND:VCARD',
            card = vCard.parse(raw);

        expect(card.fn[0].value).toEqual("Jean-Christophe de la Haute Pierre Roche-Perrin");
    });

    it('Should parse multi-line values with encoding', function () {
        var raw = 'BEGIN:VCARD\r\nFN;ENCODING=QUOTED-PRINTABLE:Ren=E9=\r\n  Pierre\r\nEND:VCARD',
            card = vCard.parse(raw);

        expect(card.fn[0].value).toEqual("René Pierre");
    });
    
    it('Should decode Quoted-Printable encoded value', function () {
        var raw = 'FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:Jos=C3=A9 Garc=C3=ADa',
            card = vCard.parse(raw);

        expect(card.fn).toEqual([{
            value: 'José García',
            meta: {
                charset: ['UTF-8'],
                encoding: ['QUOTED-PRINTABLE']
            }
        }]);
    });


    });

