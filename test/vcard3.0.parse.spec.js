var vCard = require('../lib/vcard');

describe('vCard 3.0 Parsing - Comprehensive RFC 2426 Test Suite', function () {

    describe('Required Properties', function () {
        it('should parse BEGIN and END properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });

        it('should parse VERSION 3.0 property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version).toEqual([{value: '3.0'}]);
        });

        it('should parse FN (Formatted Name) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Mr. John Q. Public\r\nN:Public;John;Q.;Mr.;Esq.\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn).toEqual([{value: 'Mr. John Q. Public'}]);
        });

        it('should parse N (Structured Name) property - required in v3.0', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n[0].value).toEqual(['Doe', 'John', '', '', '', '']);
        });
    });

    describe('Identification Properties', function () {
        it('should parse N (Name) with all components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Public;John;Quinlan;Mr.;Esq.\r\nFN:Mr. John Q. Public, Esq.\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n[0].value).toEqual(['Public', 'John', 'Quinlan', 'Mr.', 'Esq.']);
        });

        it('should parse N with minimal components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Doe;John;;;;\r\nFN:John Doe\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n[0].value).toEqual(['Doe', 'John', '', '', '', '']);
        });

        it('should parse NICKNAME property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nNICKNAME:Johnny\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.nickname).toEqual([{value: 'Johnny'}]);
        });

        it('should parse PHOTO property with VALUE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nPHOTO;VALUE=URI;TYPE=JPEG:http://example.com/photo.jpg\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].value).toEqual('http://example.com/photo.jpg');
            expect(card.photo[0].meta.value).toEqual(['URI']);
        });

        it('should parse PHOTO with BASE64 encoding (no QUOTED-PRINTABLE in v3.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nPHOTO;TYPE=JPEG;ENCODING=B:TUlJQ2FqQ0NBZE9nQXdJQkFnSUNCRVV3RFFZSktvWkloVmNOQVFFRQ==\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].meta.type).toEqual(['JPEG']);
            expect(card.photo[0].meta.encoding).toEqual(['B']);
        });

        it('should parse BDAY as date', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nBDAY:1987-09-27\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday).toEqual([{value: '1987-09-27'}]);
        });

        it('should parse BDAY as date-time', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nBDAY:1987-09-27T08:30:00Z\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday).toEqual([{value: '1987-09-27T08:30:00Z'}]);
        });
    });

    describe('Delivery Address Properties', function () {
        it('should parse ADR (Address) property with all components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nADR;TYPE=WORK,POSTAL,PARCEL:;;123 Main St;Anytown;CA;91921-1234;USA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].value).toEqual(['', '', '123 Main St', 'Anytown', 'CA', '91921-1234', 'USA']);
        });

        it('should parse ADR with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nADR;TYPE=HOME:;;123 Main St;Anytown;CA;91921;USA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.type).toEqual(['HOME']);
        });

        it('should parse ADR with PREF parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nADR;TYPE=HOME;PREF=1:;;123 Main St;Anytown;CA;91921;USA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.pref).toEqual(['1']);
        });

        it('should parse LABEL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nLABEL;TYPE=HOME:123 Main St\\nAnytown, CA 91921\\nUSA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.label[0].meta.type).toEqual(['HOME']);
        });

        it('should parse GEO (Geographical) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nGEO:37.386013;-122.082932\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.geo).toEqual([{
                value: ['37.386013', '-122.082932']
            }]);
        });

        it('should parse TZ (Timezone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTZ:-05:00\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz).toEqual([{value: '-05:00'}]);
        });

        it('should parse TZ with VALUE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTZ;VALUE=text:Eastern Standard Time\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz[0].meta.value).toEqual(['text']);
        });
    });

    describe('Telecommunications Properties', function () {
        it('should parse TEL (Telephone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel).toEqual([{value: '+1-203-555-1234'}]);
        });

        it('should parse TEL with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL;TYPE=WORK:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should parse TEL with multiple TYPE values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL;TYPE=WORK;TYPE=VOICE;TYPE=MSG:+1-213-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE', 'MSG']);
        });

        it('should parse EMAIL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nEMAIL:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email).toEqual([{value: 'john@example.com'}]);
        });

        it('should parse EMAIL with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nEMAIL;TYPE=INTERNET:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['INTERNET']);
        });

        it('should parse MAILER property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nMAILER:Mozilla Thunderbird\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.mailer).toEqual([{value: 'Mozilla Thunderbird'}]);
        });
    });

    describe('Organizational Properties', function () {
        it('should parse ORG (Organization) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nORG:ACME Corporation;Research Division\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.org[0].value).toEqual(['ACME Corporation', 'Research Division']);
        });

        it('should parse TITLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTITLE:Director\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.title).toEqual([{value: 'Director'}]);
        });

        it('should parse ROLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nROLE:Programmer\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.role).toEqual([{value: 'Programmer'}]);
        });

        it('should parse LOGO property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nLOGO;VALUE=URI:http://example.com/logo.gif\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.logo[0].value).toEqual('http://example.com/logo.gif');
            expect(card.logo[0].meta.value).toEqual(['URI']);
        });

        it('should parse AGENT property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nAGENT;VALUE=URI:CID:external@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.agent[0].value).toEqual('CID:external@example.com');
        });

        it('should parse SORT-STRING property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nSORT-STRING:Harten\r\nFN:René van der Harten\r\nN:van der Harten;René;J.;Sir;R.D.O.N.\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['sort-string']).toEqual([{value: 'Harten'}]);
        });
    });

    describe('Explanatory Properties', function () {
        it('should parse CATEGORIES property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nCATEGORIES:Business,Work,Friends\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.categories[0].value).toEqual(['Business', 'Work', 'Friends']);
        });

        it('should parse NOTE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nNOTE:This person has an evil twin\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: 'This person has an evil twin'}]);
        });

        it('should parse PRODID property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//MyCompany//NONSGML My Product 1.0//EN\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.prodid).toEqual([{value: '-//MyCompany//NONSGML My Product 1.0//EN'}]);
        });

        it('should parse REV (Revision) property as date-time', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nREV:2024-01-15T10:30:00Z\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.rev).toEqual([{value: '2024-01-15T10:30:00Z'}]);
        });

        it('should parse UID property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nUID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.uid).toEqual([{value: 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6'}]);
        });

        it('should parse URL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nURL:http://www.example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.url).toEqual([{value: 'http://www.example.com'}]);
        });

        it('should parse SOUND property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nSOUND;VALUE=URI;TYPE=BASIC:http://example.com/sound.wav\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.sound[0].value).toEqual('http://example.com/sound.wav');
            expect(card.sound[0].meta.value).toEqual(['URI']);
        });

        it('should parse CLASS (Access Classification) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nCLASS:PUBLIC\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.class).toEqual([{value: 'PUBLIC'}]);
        });

        it('should parse KEY property with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nKEY;TYPE=PGP;VALUE=URI:http://example.com/key.asc\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.key[0].meta.type).toEqual(['PGP']);
        });
    });

    describe('Encoding and Character Set (vCard 3.0 differences)', function () {
        it('vCard 3.0 should NOT use QUOTED-PRINTABLE encoding', function () {
            // In vCard 3.0, QUOTED-PRINTABLE is eliminated
            // Only "B" (Base64) encoding is allowed
            // This is a documentation test
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version[0].value).toEqual('3.0');
        });

        it('vCard 3.0 should NOT have CHARSET parameter on properties', function () {
            // CHARSET parameter is eliminated in v3.0
            // Character set can only be specified on the MIME Content-Type header
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:José García\r\nN:García;José;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            // Charset is not part of the vCard content, only on Content-Type header
            expect(card.fn[0].meta).toBeUndefined();
        });

        it('should parse BASE64 encoded binary data in v3.0', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nPHOTO;TYPE=JPEG;ENCODING=B:' +
                'TUlJQ2FqQ0NBZE9nQXdJQkFnSUNCRVV3RFFZSktvWkloVmNOQVFFRQo=' +
                '\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].meta.encoding).toEqual(['B']);
        });

        it('should handle line folding correctly in v3.0', function () {
            var raw = 'NOTE:This is a long note that\r\n continues on the next\r\n line\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note[0].value).toBeDefined();
        });
    });

    describe('Parameter Extensions in vCard 3.0', function () {
        it('should parse LANGUAGE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;LANGUAGE=en:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].meta.language).toEqual(['en']);
        });

        it('should parse TYPE parameter with multiple values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL;TYPE=WORK;TYPE=FAX;TYPE=VOICE:+1-203-555-5555\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type.length).toEqual(3);
            expect(card.tel[0].meta.type).toContain('WORK');
            expect(card.tel[0].meta.type).toContain('FAX');
            expect(card.tel[0].meta.type).toContain('VOICE');
        });

        it('should parse VALUE parameter for type specification', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nBDAY;VALUE=date:1987-09-27\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday[0].meta.value).toEqual(['date']);
        });

        it('should handle ENCODING parameter with "B" for BASE64', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nPHOTO;ENCODING=B;TYPE=JPEG:abcd1234==\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].meta.encoding).toEqual(['B']);
        });
    });

    describe('Complex vCard 3.0 Structures', function () {
        it('should parse complete vCard 3.0 with all major properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\n' +
                'FN:Mr. John Q. Public\\, Esq.\r\n' +
                'N:Public;John;Quinlan;Mr.;Esq.\r\n' +
                'ORG:ACME;Research;Development\r\n' +
                'TITLE:Senior Research Scientist\r\n' +
                'ROLE:Inventor\r\n' +
                'TEL;TYPE=WORK,VOICE:+1-617-555-1234\r\n' +
                'EMAIL;TYPE=INTERNET:john.public@example.com\r\n' +
                'ADR;TYPE=WORK:;;123 Main St;Boston;MA;02101;USA\r\n' +
                'URL:http://www.example.com\r\n' +
                'UID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\n' +
                'REV:2024-01-15T10:30:00Z\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('Mr. John Q. Public, Esq.');
            expect(card.n[0].value[0]).toEqual('Public');
            expect(card.org[0].value[0]).toEqual('ACME');
            expect(card.title[0].value).toEqual('Senior Research Scientist');
            expect(card.role[0].value).toEqual('Inventor');
            expect(card.tel[0].value).toEqual('+1-617-555-1234');
            expect(card.email[0].value).toEqual('john.public@example.com');
            expect(card.url[0].value).toEqual('http://www.example.com');
        });

        it('should handle vCard with multiple addresses', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\n' +
                'FN:Jane Doe\r\n' +
                'N:Doe;Jane;;;;\r\n' +
                'ADR;TYPE=HOME:;;456 Maple Ave;Portland;OR;97213;USA\r\n' +
                'ADR;TYPE=WORK:;;789 Oak Blvd;San Francisco;CA;94102;USA\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.adr.length).toEqual(2);
            expect(card.adr[0].meta.type).toEqual(['HOME']);
            expect(card.adr[1].meta.type).toEqual(['WORK']);
        });

        it('should handle vCard with multiple phone numbers and emails', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\n' +
                'FN:Bob Smith\r\n' +
                'N:Smith;Bob;;;;\r\n' +
                'TEL;TYPE=HOME:+1-555-1234\r\n' +
                'TEL;TYPE=WORK:+1-555-5678\r\n' +
                'TEL;TYPE=CELL:+1-555-9999\r\n' +
                'EMAIL;TYPE=INTERNET:bob@home.com\r\n' +
                'EMAIL;TYPE=INTERNET:bob@work.com\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.tel.length).toEqual(3);
            expect(card.email.length).toEqual(2);
        });
    });

    describe('Special Characters and Escaping', function () {
        it('should handle escaped commas in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Smith\\, John and Jones\\, Mary\r\nN:Smith\\, John;;;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('Smith, John and Jones, Mary');
        });

        it('should handle escaped semicolons in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTITLE:Director\\; VP\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.title[0].value).toEqual('Director; VP');
        });

        it('should handle escaped newlines in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nNOTE:Line 1\\nLine 2\\nLine 3\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note[0].value).toContain('\n');
        });

        it('should handle Unicode characters in values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:François Müller\r\nN:Müller;François;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('François Müller');
        });

        it('should handle apostrophes and special punctuation', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:O\'Neill-Smith\r\nN:O\'Neill-Smith;;;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('O\'Neill-Smith');
        });
    });

    describe('Edge Cases and Error Handling', function () {
        it('should handle empty property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nNOTE:\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: ''}]);
        });

        it('should handle properties with only parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL;TYPE=WORK:\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].value).toEqual('');
            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should skip empty lines', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\n\r\nFN:John Doe\r\n\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle different line ending styles (CRLF)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle different line ending styles (LF)', function () {
            var raw = 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nN:Doe;John;;;;\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle mixed line ending styles', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\nFN:John Doe\r\nN:Doe;John;;;;\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should preserve meta information for all parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nEMAIL;TYPE=INTERNET;PREF=1:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['INTERNET']);
            expect(card.email[0].meta.pref).toEqual(['1']);
        });

        it('should handle vCard with no parameters (no meta object)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].meta).toBeUndefined();
            expect(card.fn[0].value).toEqual('John Doe');
        });
    });

    describe('Non-standard Extensions (X- properties)', function () {
        it('should parse X- (non-standard) properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-CUSTOMFIELD:Custom Value\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-CUSTOMFIELD']).toEqual([{value: 'Custom Value'}]);
        });

        it('should preserve case of X- properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-MyProperty:Value\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-MyProperty']).toBeDefined();
        });

        it('should handle X- properties with parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-CUSTOM;TYPE=WORK:Custom Value\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-CUSTOM'][0].meta.type).toEqual(['WORK']);
        });
    });

    describe('RFC 2426 Compliance Notes', function () {
        it('FN and N properties MUST be present in vCard 3.0', function () {
            // This test documents RFC requirement
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn).toBeDefined();
            expect(card.n).toBeDefined();
        });

        it('VERSION property MUST be "3.0" for vCard 3.0 compliance', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version[0].value).toEqual('3.0');
        });

        it('TYPE parameter prefers semicolon-separated values over comma-separated', function () {
            // In v3.0, multiple TYPE values should use TYPE=value;TYPE=value syntax
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nTEL;TYPE=WORK;TYPE=VOICE:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE']);
        });
    });

    describe('Group Properties', function () {
        it('should handle grouped properties with dot notation', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:3.0\r\nitem1.TEL;TYPE=WORK:+1-617-555-1234\r\nitem1.URL:http://example.com/jdoe\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].namespace).toEqual('item1');
            expect(card.url[0].namespace).toEqual('item1');
        });
    });
});
