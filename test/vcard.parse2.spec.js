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

       it('multiple line', function () {
        var raw = 
`BEGIN:VCARD
VERSION:2.1
N:Gump;Forrest;;Mr.
FN:Forrest Gump
ORG:Bubba Gump Shrimp Co.
TITLE:Shrimp Man
PHOTO;GIF:http://www.example.com/dir_photos/my_photo.gif
LOGO;JPG:https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/TomHanksForrestGump94.jpg/224px-TomHanksForrestGump94.jpg
TEL;WORK;VOICE:(111) 555-1212
TEL;HOME;VOICE:(404) 555-1212
ADR;WORK;PREF:;;100 Waters Edge;Baytown;LA;30314;United States of America
LABEL;WORK;PREF;ENCODING=QUOTED-PRINTABLE;CHARSET=UTF-8:100 Waters Edge=0D=
 =0ABaytown\, LA 30314=0D=0AUnited States of America
ADR;HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America
LABEL;HOME;ENCODING=QUOTED-PRINTABLE;CHARSET=UTF-8:42 Plantation St.=0D=0A=
 Baytown, LA 30314=0D=0AUnited States of America
EMAIL:forrestgump@example.com
REV:20080424T195243Z
END:VCARD`;
            card = vCard.parse(raw);

        expect(card.n[0].value).toEqual(['Gump', 'Forrest', '', 'Mr.']);
    }); 


     it('multiple line2', function () {
        var raw = 
`BEGIN:VCARD
VERSION:3.0
PRODID:-//JGZ//vCardz_i Version 1.9.3//EN 
REV:20210422T054012
FN;CHARSET=UTF-8:Full Name
TITLE:Title
ROLE:Role
N;CHARSET=UTF-8:Last Name;First Name;Middle Name;Prefix;Suffix
NICKNAME:Nickname
ADR;TYPE=HOME:P.O. Box Suite;;Home Address;City;State;Zip Code;Country
ADR;TYPE=WORK:P.O. Box/Suite;;Work Address;City;State;Zip Code;Country
NOTE;TYPE=HOME:Home Note
NOTE;TYPE=WORK:Work Note
BDAY:Birthday
ANNIVERSARY:Anniversary
RELATED:Related
ORG:Org
CATEGORIES:Cat
TEL;TYPE=PREF:Phone1
TEL;TYPE=CELL:Phone2
TEL;TYPE=WORK:Phone3
TEL;TYPE=OTHER:Phone4
TEL;TYPE=OTHER:Phone5
EMAIL:E-Mail1
EMAIL:E-Mail2
EMAIL:E-Mail3
URL:URL
END:VCARD`;
            card = vCard.parse(raw);

        expect(card.n[0].value).toEqual(['Last Name', 'First Name', 'Middle Name', 'Prefix', 'Suffix']);
    }); 

    it('Should decode Quoted-Printable with special characters', function () {
        var raw = 'ADR;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:123 Rue de l=27=C3=89toile',
            card = vCard.parse(raw);

        expect(card.adr).toEqual([{
            value: "123 Rue de l'Étoile",
            meta: {
                charset: ['UTF-8'],
                encoding: ['QUOTED-PRINTABLE']
            }
        }]);
    });


    });

