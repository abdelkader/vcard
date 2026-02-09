var vCard = require('../lib/vcard');

describe('vCard 4.0 Parsing - Comprehensive RFC 6350 Test Suite', function () {

    describe('Required Properties', function () {
        it('should parse BEGIN and END properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });

        it('should parse VERSION 4.0 property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version).toEqual([{value: '4.0'}]);
        });

        it('should parse FN (Formatted Name) property - required in v4.0', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:Mr. John Q. Public\r\nN:Public;John;Q.;Mr.;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn).toEqual([{value: 'Mr. John Q. Public'}]);
        });

        it('should parse N (Structured Name) property - required in v4.0', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n[0].value).toEqual(['Doe', 'John', '', '', '', '']);
        });

        it('should parse UID (Unique Identifier) property - required in v4.0', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.uid).toEqual([{value: 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6'}]);
        });
    });

    describe('Identification Properties', function () {
        it('should parse N (Name) with all components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Public;John;Quinlan;Mr.;Esq.\r\nFN:Mr. John Q. Public\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.n[0].value).toEqual(['Public', 'John', 'Quinlan', 'Mr.', 'Esq.']);
        });

        it('should parse NICKNAME property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nNICKNAME:Johnny\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.nickname).toEqual([{value: 'Johnny'}]);
        });

        it('should parse PHOTO property with VALUE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nPHOTO;VALUE=URI;MEDIATYPE=image/jpeg:http://example.com/photo.jpg\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].value).toEqual('http://example.com/photo.jpg');
            expect(card.photo[0].meta.value).toEqual(['URI']);
        });

        it('should parse BDAY as date', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nBDAY:19870927\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday).toEqual([{value: '19870927'}]);
        });

        it('should parse BDAY with VALUE=date-and-or-time parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nBDAY;VALUE=date:19870927\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday[0].meta.value).toEqual(['date']);
        });

        it('should parse ANNIVERSARY property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nANNIVERSARY:20090415\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.anniversary).toEqual([{value: '20090415'}]);
        });

        it('should parse GENDER property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nGENDER:M\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.gender).toEqual([{value: 'M'}]);
        });

        it('should parse GENDER with text component', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nGENDER:M;transgender male\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.gender[0].value).toEqual(['M', 'transgender male']);
        });
    });

    describe('Delivery Address Properties', function () {
        it('should parse ADR (Address) property with all components', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nADR;TYPE=WORK,POSTAL,PARCEL:;;123 Main St;Anytown;CA;91921-1234;USA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].value).toEqual(['', '', '123 Main St', 'Anytown', 'CA', '91921-1234', 'USA']);
        });

        it('should parse ADR with PREF parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nADR;TYPE=HOME;PREF=1:;;123 Main St;Anytown;CA;91921;USA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.adr[0].meta.pref).toEqual(['1']);
        });

        it('should parse LABEL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nLABEL;TYPE=HOME:123 Main St\\nAnytown, CA 91921\\nUSA\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.label[0].meta.type).toEqual(['HOME']);
        });

        it('should parse GEO (Geographical) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nGEO:geo:37.386013,-122.082932\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.geo).toBeDefined();
        });

        it('should parse TZ (Timezone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTZ:-05:00\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz).toEqual([{value: '-05:00'}]);
        });

        it('should parse TZ with TZID parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTZ;TZID=America/New_York:America/New_York\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tz[0].meta.tzid).toEqual(['America/New_York']);
        });
    });

    describe('Telecommunications Properties', function () {
        it('should parse TEL (Telephone) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTEL:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel).toEqual([{value: '+1-203-555-1234'}]);
        });

        it('should parse TEL with TYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTEL;TYPE=WORK:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should parse TEL with multiple TYPE values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTEL;TYPE=WORK;TYPE=VOICE;TYPE=TEXT:+1-213-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.type).toEqual(['WORK', 'VOICE', 'TEXT']);
        });

        it('should parse EMAIL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nEMAIL:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email).toEqual([{value: 'john@example.com'}]);
        });

        it('should parse EMAIL with TYPE parameter (no INTERNET default in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nEMAIL;TYPE=WORK:john@work.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['WORK']);
        });

        it('should parse IMPP (Instant Messaging Protocol) property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nIMPP;TYPE=PERSONAL:xmpp:john.doe@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.impp).toBeDefined();
        });

        it('should parse MAILER property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nMAILER:Mozilla Thunderbird 78.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.mailer).toEqual([{value: 'Mozilla Thunderbird 78.0'}]);
        });
    });

    describe('Organizational Properties', function () {
        it('should parse ORG (Organization) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nORG:ACME Corporation;Research Division\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.org[0].value).toEqual(['ACME Corporation', 'Research Division']);
        });

        it('should parse TITLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTITLE:Director\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.title).toEqual([{value: 'Director'}]);
        });

        it('should parse ROLE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nROLE:Programmer\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.role).toEqual([{value: 'Programmer'}]);
        });

        it('should parse LOGO property with MEDIATYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nLOGO;VALUE=URI;MEDIATYPE=image/gif:http://example.com/logo.gif\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.logo[0].value).toEqual('http://example.com/logo.gif');
            expect(card.logo[0].meta.mediatype).toEqual(['image/gif']);
        });

        it('should parse SORT-STRING property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nSORT-STRING:Harten\r\nFN:René van der Harten\r\nN:van der Harten;René;J.;Sir;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['sort-string']).toEqual([{value: 'Harten'}]);
        });
    });

    describe('Explanatory Properties', function () {
        it('should parse CATEGORIES property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nCATEGORIES:Business,Work,Friends\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.categories[0].value).toEqual(['Business', 'Work', 'Friends']);
        });

        it('should parse NOTE property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nNOTE:This person has an evil twin\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: 'This person has an evil twin'}]);
        });

        it('should parse PRODID property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nPRODID:-//MyCompany//NONSGML My Product 2.0//EN\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.prodid).toEqual([{value: '-//MyCompany//NONSGML My Product 2.0//EN'}]);
        });

        it('should parse REV (Revision) property as datetime', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nREV:20240115T103000Z\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.rev).toEqual([{value: '20240115T103000Z'}]);
        });

        it('should parse URL property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nURL:http://www.example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.url).toEqual([{value: 'http://www.example.com'}]);
        });

        it('should parse SOUND property with VALUE=URI', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nSOUND;VALUE=URI;MEDIATYPE=audio/basic:http://example.com/sound.wav\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.sound[0].value).toEqual('http://example.com/sound.wav');
        });

        it('should parse CLASS (Access Classification) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nCLASS:PUBLIC\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.class).toEqual([{value: 'PUBLIC'}]);
        });

        it('should parse KEY property with MEDIATYPE', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nKEY;TYPE=PGP;VALUE=URI;MEDIATYPE=application/pgp-keys:http://example.com/key.asc\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.key[0].meta.mediatype).toEqual(['application/pgp-keys']);
        });
    });

    describe('New Properties in vCard 4.0', function () {
        it('should parse RELATED property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nRELATED;TYPE=SPOUSE:urn:uuid:spouse-uid\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.related).toBeDefined();
        });

        it('should parse KIND property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nKIND:individual\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.kind).toEqual([{value: 'individual'}]);
        });

        it('should parse KIND:organization', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nKIND:organization\r\nFN:ACME Organization\r\nN:Organization;ACME;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.kind).toEqual([{value: 'organization'}]);
        });

        it('should parse MEMBER property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nMEMBER:urn:uuid:member1\r\nFN:Team\r\nN:Team;;;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.member).toBeDefined();
        });

        it('should parse FBURL (Free-Busy URL) property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFBURL:http://example.com/fb/john\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fburl).toBeDefined();
        });

        it('should parse CALURI (Calendar URI) property (new in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nCALURI:http://example.com/calendar/john\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.caluri).toBeDefined();
        });

        it('should parse CALADRURI (Calendar Address URI) property', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nCALADRURI:mailto:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.caladruri).toBeDefined();
        });
    });

    describe('Parameter Extensions in vCard 4.0', function () {
        it('should parse LANGUAGE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN;LANGUAGE=en:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].meta.language).toEqual(['en']);
        });

        it('should parse ALTID parameter (alternative ID in v4.0)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN;ALTID=1:John Doe\r\nFN;ALTID=1;LANGUAGE=ja:ジョン・ドゥ\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].meta.altid).toEqual(['1']);
        });

        it('should parse PREF parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTEL;TYPE=WORK;PREF=1:+1-203-555-1234\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].meta.pref).toEqual(['1']);
        });

        it('should parse MEDIATYPE parameter', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nPHOTO;VALUE=URI;MEDIATYPE=image/jpeg:http://example.com/photo.jpg\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].meta.mediatype).toEqual(['image/jpeg']);
        });

        it('should parse CALSCALE parameter (calendar scale)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nBDAY;CALSCALE=gregorian:19870927\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.bday[0].meta.calscale).toEqual(['gregorian']);
        });
    });

    describe('Complex vCard 4.0 Structures', function () {
        it('should parse complete vCard 4.0 with all major properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\n' +
                'FN:Mr. John Q. Public Esq.\r\n' +
                'N:Public;John;Quinlan;Mr.;Esq.\r\n' +
                'GENDER:M\r\n' +
                'ANNIVERSARY:20090415\r\n' +
                'ORG:ACME;Research;Development\r\n' +
                'TITLE:Senior Research Scientist\r\n' +
                'ROLE:Inventor\r\n' +
                'TEL;TYPE=WORK,VOICE:+1-617-555-1234\r\n' +
                'EMAIL;TYPE=WORK:john.public@example.com\r\n' +
                'ADR;TYPE=WORK:;;123 Main St;Boston;MA;02101;USA\r\n' +
                'URL:http://www.example.com\r\n' +
                'UID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\n' +
                'REV:20240115T103000Z\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('Mr. John Q. Public Esq.');
            expect(card.gender[0].value).toEqual('M');
            expect(card.anniversary[0].value).toEqual('20090415');
            expect(card.uid[0].value).toEqual('urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
        });

        it('should handle vCard with multiple addresses', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\n' +
                'FN:Jane Doe\r\n' +
                'N:Doe;Jane;;;;\r\n' +
                'ADR;TYPE=HOME:;;456 Maple Ave;Portland;OR;97213;USA\r\n' +
                'ADR;TYPE=WORK:;;789 Oak Blvd;San Francisco;CA;94102;USA\r\n' +
                'UID:urn:uuid:test\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.adr.length).toEqual(2);
            expect(card.adr[0].meta.type).toEqual(['HOME']);
            expect(card.adr[1].meta.type).toEqual(['WORK']);
        });

        it('should handle vCard with multiple phone numbers and emails', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\n' +
                'FN:Bob Smith\r\n' +
                'N:Smith;Bob;;;;\r\n' +
                'TEL;TYPE=HOME:+1-555-1234\r\n' +
                'TEL;TYPE=WORK:+1-555-5678\r\n' +
                'TEL;TYPE=CELL:+1-555-9999\r\n' +
                'EMAIL;TYPE=WORK:bob@work.com\r\n' +
                'EMAIL;TYPE=HOME:bob@home.com\r\n' +
                'UID:urn:uuid:test\r\n' +
                'END:VCARD',
                card = vCard.parse(raw);

            expect(card.tel.length).toEqual(3);
            expect(card.email.length).toEqual(2);
        });
    });

    describe('Special Characters and Escaping', function () {
        it('should handle escaped commas in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:Smith\\, John and Jones\\, Mary\r\nN:Smith\\, John;;;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('Smith, John and Jones, Mary');
        });

        it('should handle escaped semicolons in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTITLE:Director\\; VP\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.title[0].value).toEqual('Director; VP');
        });

        it('should handle escaped newlines in property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nNOTE:Line 1\\nLine 2\\nLine 3\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note[0].value).toContain('\n');
        });

        it('should handle Unicode characters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:François Müller\r\nN:Müller;François;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('François Müller');
        });

        it('should handle CJK characters (CJK = Chinese, Japanese, Korean)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:田中太郎\r\nN:田中;太郎;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('田中太郎');
        });
    });

    describe('Edge Cases and Error Handling', function () {
        it('should handle empty property values', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nNOTE:\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.note).toEqual([{value: ''}]);
        });

        it('should handle properties with only parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nTEL;TYPE=WORK:\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].value).toEqual('');
            expect(card.tel[0].meta.type).toEqual(['WORK']);
        });

        it('should skip empty lines', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\n\r\nFN:John Doe\r\n\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle different line ending styles (CRLF)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should handle different line ending styles (LF)', function () {
            var raw = 'BEGIN:VCARD\nVERSION:4.0\nFN:John Doe\nN:Doe;John;;;;\nUID:urn:uuid:test\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].value).toEqual('John Doe');
        });

        it('should preserve meta information for all parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nEMAIL;TYPE=WORK;PREF=1:john@example.com\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.email[0].meta.type).toEqual(['WORK']);
            expect(card.email[0].meta.pref).toEqual(['1']);
        });

        it('should handle vCard with no parameters (no meta object)', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn[0].meta).toBeUndefined();
            expect(card.fn[0].value).toEqual('John Doe');
        });
    });

    describe('Non-standard Extensions (X- properties)', function () {
        it('should parse X- (non-standard) properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-CUSTOMFIELD:Custom Value\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-CUSTOMFIELD']).toEqual([{value: 'Custom Value'}]);
        });

        it('should preserve case of X- properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-MyProperty:Value\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-MyProperty']).toBeDefined();
        });

        it('should handle X- properties with parameters', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nX-CUSTOM;TYPE=WORK:Custom Value\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card['X-CUSTOM'][0].meta.type).toEqual(['WORK']);
        });
    });

    describe('RFC 6350 Compliance Notes', function () {
        it('FN, N, and UID properties MUST be present in vCard 4.0', function () {
            // This test documents RFC 6350 requirements
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn).toBeDefined();
            expect(card.n).toBeDefined();
            expect(card.uid).toBeDefined();
        });

        it('VERSION property MUST be "4.0" for vCard 4.0 compliance', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version[0].value).toEqual('4.0');
        });

        it('vCard 4.0 uses RFC 6350 instead of RFC 2426', function () {
            // This test documents the specification version
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.version[0].value).toEqual('4.0');
        });

        it('vCard 4.0 supports MEDIATYPE parameter instead of TYPE for media properties', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nPHOTO;VALUE=URI;MEDIATYPE=image/jpeg:http://example.com/photo.jpg\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.photo[0].meta.mediatype).toEqual(['image/jpeg']);
        });

        it('vCard 4.0 allows multiple equivalent representations with ALTID', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN;ALTID=1:John Doe\r\nFN;ALTID=1;LANGUAGE=ja:ジョン・ドゥ\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.fn.length).toEqual(2);
        });
    });

    describe('Group Properties', function () {
        it('should handle grouped properties with dot notation', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nitem1.TEL;TYPE=WORK:+1-617-555-1234\r\nitem1.URL:http://example.com/jdoe\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.tel[0].namespace).toEqual('item1');
            expect(card.url[0].namespace).toEqual('item1');
        });
    });

    describe('Comparison: vCard 2.1 vs 3.0 vs 4.0 Differences', function () {
        it('vCard 4.0 eliminates AGENT property', function () {
            // AGENT was in 2.1 and 3.0, but not recommended in 4.0
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card).toBeDefined();
        });

        it('vCard 4.0 introduces ANNIVERSARY for spouse anniversary dates', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nANNIVERSARY:20090415\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.anniversary).toBeDefined();
        });

        it('vCard 4.0 introduces GENDER for gender identity', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nGENDER:M\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.gender).toBeDefined();
        });

        it('vCard 4.0 introduces KIND for vCard entity type', function () {
            var raw = 'BEGIN:VCARD\r\nVERSION:4.0\r\nKIND:individual\r\nFN:John Doe\r\nN:Doe;John;;;;\r\nUID:urn:uuid:test\r\nEND:VCARD',
                card = vCard.parse(raw);

            expect(card.kind).toBeDefined();
        });
    });
});
