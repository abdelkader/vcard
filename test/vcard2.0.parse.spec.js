var vCard = require('../lib/vcard');

describe('vCard 2.0/2.1 Parsing - Comprehensive RFC Test Suite', function () {

    describe('Required Properties', function () {
        it('should parse BEGIN and END properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });

        it('should parse VERSION property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version).toEqual([{value: '2.1'}]);
        });

        it('should parse FN (Formatted Name) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nFN:Mr. John Q. Public\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn).toEqual([{value: 'Mr. John Q. Public'}]);
        });
    });

    describe('Identification Properties', function () {
        it('should parse N (Structured Name) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nN:Public;John;Quinlan;Mr.;Esq.\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n).toEqual([{
                value: ['Public', 'John', 'Quinlan', 'Mr.', 'Esq.']
            }]);
        });

        it('should parse N property with multiple middle names', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nN:Stevenson;John;Philip,Paul;Dr.;Jr.,M.D.\r\nEND:VCARD',
                card = vCard.parse(raw);

            // Parser keeps comma-separated values as string
            expect(card.n[0].value[2]).toEqual('Philip,Paul');
        });

        it('should parse NICKNAME property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nNICKNAME:Johnny\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.nickname).toEqual([{value: 'Johnny'}]);
        });

        it('should parse multiple NICKNAME values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nNICKNAME:Johnny,Jack\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.nickname[0].value).toEqual(['Johnny', 'Jack']);
        });

        it('should parse PHOTO property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nPHOTO;VALUE=URI:http://example.com/photo.jpg\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].value).toEqual('http://example.com/photo.jpg');
            expect(card.photo[0].meta.value).toEqual(['URI']);
        });

        it('should parse BDAY (Birthday) as date', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nBDAY:1987-09-27\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday).toEqual([{value: '1987-09-27'}]);
        });

        it('should parse BDAY as date-time', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nBDAY:1987-09-27T08:30:00Z\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday).toEqual([{value: '1987-09-27T08:30:00Z'}]);
        });
    });

    describe('Address Properties', function () {
        it('should parse ADR (Address) property with all components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nADR:;;123 Main St;Anytown;CA;91921-1234;USA\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].value).toEqual(['', '', '123 Main St', 'Anytown', 'CA', '91921-1234', 'USA']);
        });

        it('should parse ADR with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nADR;TYPE=HOME:;;123 Main St;Anytown;CA;91921-1234;USA\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.type).toEqual(['HOME']);
        });

        it('should parse ADR with multiple TYPE values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nADR;TYPE=DOM;TYPE=HOME;TYPE=POSTAL:;;123 Main St;Anytown;CA;91921;USA\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.type).toEqual(['DOM', 'HOME', 'POSTAL']);
        });

        it('should parse LABEL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nLABEL;TYPE=HOME:123 Main St\\nAnytown, CA 91921\\nUSA\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.label[0].meta.type).toEqual(['HOME']);
        });

        it('should parse GEO (Geographical) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nGEO:37.386013;-122.082932\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.geo).toEqual([{
                value: ['37.386013', '-122.082932']
            }]);
        });

        it('should parse TZ (Timezone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTZ:-05:00\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz).toEqual([{value: '-05:00'}]);
        });

        it('should parse TZ with VALUE=text', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTZ;VALUE=text:Eastern Standard Time\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz[0].value).toEqual('Eastern Standard Time');
            expect(card.tz[0].meta.value).toEqual(['text']);
        });
    });

    describe('Telecommunications Properties', function () {
        it('should parse TEL (Telephone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTEL:+1-203-555-1234\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel).toEqual([{value: '+1-203-555-1234'}]);
        });

        it('should parse TEL with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTEL;TYPE=WORK:+1-203-555-1234\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should parse TEL with multiple TYPE values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTEL;TYPE=WORK;TYPE=VOICE;TYPE=MSG:+1-213-555-1234\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE', 'MSG']);
        });

        it('should parse multiple TEL properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTEL;TYPE=WORK:+1-203-555-1234\r\nTEL;TYPE=HOME:+1-203-555-5678\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel.length).toEqual(2);
            expect(card.tel[0].value).toEqual('+1-203-555-1234');
            expect(card.tel[1].value).toEqual('+1-203-555-5678');
        });

        it('should parse EMAIL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nEMAIL:john@example.com\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email).toEqual([{value: 'john@example.com'}]);
        });

        it('should parse EMAIL with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nEMAIL;TYPE=INTERNET:john@example.com\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['INTERNET']);
        });

        it('should parse MAILER property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nMAILER:Mozilla Thunderbird\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.mailer).toEqual([{value: 'Mozilla Thunderbird'}]);
        });
    });

    describe('Organizational Properties', function () {
        it('should parse ORG property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nORG:ACME Corporation;Research Division\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.org[0].value).toEqual(['ACME Corporation', 'Research Division']);
        });

        it('should parse ORG with single value', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nORG:ACME Corporation\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.org[0].value).toEqual('ACME Corporation');
        });

        it('should parse TITLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nTITLE:Director\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.title).toEqual([{value: 'Director'}]);
        });

        it('should parse ROLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nROLE:Programmer\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.role).toEqual([{value: 'Programmer'}]);
        });

        it('should parse LOGO property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nLOGO;VALUE=URI:http://example.com/logo.gif\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.logo[0].value).toEqual('http://example.com/logo.gif');
        });

        it('should parse AGENT property with external reference', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nAGENT;VALUE=URI:CID:external@example.com\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.agent[0].value).toEqual('CID:external@example.com');
        });
    });

    describe('Explanatory Properties', function () {
        it('should parse CATEGORIES property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nCATEGORIES:Business,Work\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.categories[0].value).toEqual(['Business', 'Work']);
        });

        it('should parse NOTE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nNOTE:This is a note\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: 'This is a note'}]);
        });

        it('should parse PRODID property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nPRODID:-//Company//Product//EN\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.prodid).toEqual([{value: '-//Company//Product//EN'}]);
        });

        it('should parse REV (Revision) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nREV:2024-01-15T10:30:00Z\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.rev).toEqual([{value: '2024-01-15T10:30:00Z'}]);
        });

        it('should parse UID property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nUID:12345-67890\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.uid).toEqual([{value: '12345-67890'}]);
        });

        it('should parse URL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nURL:http://www.example.com\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.url).toEqual([{value: 'http://www.example.com'}]);
        });

        it('should parse SOUND property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\nSOUND;VALUE=URI:http://example.com/sound.wav\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.sound[0].value).toEqual('http://example.com/sound.wav');
        });
    });

    describe('Encoding and Character Set Handling', function () {
        it('should parse QUOTED-PRINTABLE encoded text without CHARSET', function () {
            var raw = 'FN;ENCODING=QUOTED-PRINTABLE:Ren=E9',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('René');
        });

        it('should parse QUOTED-PRINTABLE with explicit CHARSET=UTF-8', function () {
            var raw = 'FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:Jos=C3=A9',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('José');
            expect(card.fn[0].meta.charset).toEqual(['UTF-8']);
        });

        it('should parse QUOTED-PRINTABLE with CHARSET=ISO-8859-1', function () {
            var raw = 'FN;CHARSET=ISO-8859-1;ENCODING=QUOTED-PRINTABLE:Ren=E9',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('René');
        });

        it('should parse multi-line QUOTED-PRINTABLE with soft line break', function () {
            var raw = 'FN;ENCODING=QUOTED-PRINTABLE:This is a long line that is broken=\r\n  in the middle',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('This is a long line that is broken in the middle');
        });

        it('should handle line folding in multi-line properties', function () {
            var raw = 'NOTE:This is a very long note that\r\n is folded across multiple\r\n lines',
                card = vCard.parse(raw);

            // Parser concatenates folded lines preserving the space pattern
            expect(card.note[0].value).toEqual('This is a very long note thatis folded across multiplelines');
        });
    });

    describe('Complex Property Combinations', function () {
        it('should parse complete vCard with multiple properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\n' +
                'FN:John Q. Public\r\n' +
                'N:Public;John;Quinlan;Mr.;Esq.\r\n' +
                'ORG:ACME;Research\r\n' +
                'TITLE:Director\r\n' +
                'TEL;TYPE=WORK:+1-619-555-1234\r\n' +
                'EMAIL:john@example.com\r\n' +
                'ADR;TYPE=WORK:;;123 Main St;San Diego;CA;92110;USA\r\n' +
                'URL:http://www.example.com\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Q. Public');
            expect(card.n[0].value[0]).toEqual('Public');
            expect(card.org[0].value[0]).toEqual('ACME');
            expect(card.title[0].value).toEqual('Director');
            expect(card.tel[0].value).toEqual('+1-619-555-1234');
            expect(card.email[0].value).toEqual('john@example.com');
            expect(card.url[0].value).toEqual('http://www.example.com');
        });

        it('should handle vCard with multiple addresses', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\n' +
                'FN:John Doe\r\n' +
                'ADR;TYPE=HOME:;;123 Home St;Anytown;CA;91921;USA\r\n' +
                'ADR;TYPE=WORK:;;456 Work Ave;Worktown;CA;92110;USA\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.adr.length).toEqual(2);
            expect(card.adr[0].value[2]).toEqual('123 Home St');
            expect(card.adr[1].value[2]).toEqual('456 Work Ave');
        });

        it('should handle vCard with multiple emails', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\n' +
                'FN:John Doe\r\n' +
                'EMAIL;TYPE=WORK:john@work.com\r\n' +
                'EMAIL;TYPE=HOME:john@home.com\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.email.length).toEqual(2);
            expect(card.email[0].value).toEqual('john@work.com');
            expect(card.email[1].value).toEqual('john@home.com');
        });
    });

    describe('Special Characters and Escaping', function () {
        it('should handle escaped semicolons in text values', function () {
            var raw = 'TITLE:Director\\; VP of Operations',
                card = vCard.parse(raw);

            expect(card.title[0].value).toEqual('Director; VP of Operations');
        });

        it('should handle escaped commas in text values', function () {
            var raw = 'NOTE:Smith\\, John and Jones\\, Mary',
                card = vCard.parse(raw);

            expect(card.note[0].value).toEqual('Smith, John and Jones, Mary');
        });

        it('should handle newline sequences in text', function () {
            var raw = 'NOTE:Line 1\\nLine 2\\nLine 3',
                card = vCard.parse(raw);

            expect(card.note[0].value).toContain('\n');
        });

        it('should handle special characters in names', function () {
            var raw = 'FN:O\'Brien Smith',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('O\'Brien Smith');
        });
    });

    describe('Type Parameter Variations', function () {
        it('should parse TYPE as semicolon-separated list', function () {
            var raw = 'TEL;TYPE=WORK;TYPE=VOICE:+1-203-555-1234',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE']);
        });

        it('should parse TYPE as semicolon-separated params for multiple values', function () {
            var raw = 'TEL;TYPE=WORK;TYPE=VOICE:+1-203-555-1234',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE']);
        });

        it('should handle PREF type parameter', function () {
            var raw = 'TEL;TYPE=PREF:+1-203-555-1234',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['PREF']);
        });

        it('should preserve case of TYPE values', function () {
            var raw = 'TEL;TYPE=Work:+1-203-555-1234',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['Work']);
        });
    });

    describe('Edge Cases and Error Handling', function () {
        it('should handle empty property values', function () {
            var raw = 'NOTE:',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: ''}]);
        });

        it('should handle properties with only parameters', function () {
            var raw = 'TEL;TYPE=WORK:',
                card = vCard.parse(raw);

            expect(card.tel[0].value).toEqual('');
            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should skip empty lines', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\r\n\r\nFN:John Doe\r\n\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle whitespace in parameter values', function () {
            var raw = 'ADR;TYPE=HOME;TYPE=POSTAL:;;123 Main St;Anytown;CA;91921;USA',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.type).toEqual(['HOME', 'POSTAL']);
        });

        it('should parse vCard with no line breaks (single line)', function () {
            var raw = 'BEGIN:VCARD VERSION:2.1 FN:John Doe END:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });

        it('should handle vCard with different line ending styles', function () {
            var raw = 'BEGIN:VCARD\nVERSION:2.1\nFN:John Doe\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle mixed line ending styles', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:2.1\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });
    });

    describe('Meta Information Preservation', function () {
        it('should preserve all meta parameters', function () {
            var raw = 'EMAIL;TYPE=INTERNET;CHARSET=UTF-8:john@example.com',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['INTERNET']);
            expect(card.email[0].meta.charset).toEqual(['UTF-8']);
        });

        it('should create meta object only when parameters exist', function () {
            var raw = 'FN:John Doe',
                card = vCard.parse(raw);

            expect(card.fn[0].meta).toBeUndefined();
        });

        it('should handle multiple values for same meta parameter', function () {
            var raw = 'TEL;TYPE=WORK;TYPE=VOICE;TYPE=MSG:+1-203-555-1234',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type.length).toEqual(3);
            expect(card.tel[0].meta.type).toContain('WORK');
            expect(card.tel[0].meta.type).toContain('VOICE');
            expect(card.tel[0].meta.type).toContain('MSG');
        });
    });

    describe('RFC 2426 Compliance (vCard 3.0 differences)', function () {
        it('should note that vCard 3.0 eliminates QUOTED-PRINTABLE encoding', function () {
            // This is a documentation test - vCard 3.0 uses BASE64 only
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version[0].value).toEqual('3.0');
        });

        it('should note that vCard 3.0 eliminates CHARSET parameter on properties', function () {
            // In vCard 3.0, charset is on Content-Type header only
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });
    });
});
