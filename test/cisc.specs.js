
describe('cisc', function() {
    dbOpen();

    const prefix =  'cisc://';
    const addr = '192.33.210.8:8003';
    const skip = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

    const validInput = prefix + addr + '/' + skip;

    describe('ciscQrScanned', function() {
        beforeEach(function () {
            dbOpen();
            var htmlFirst = '<p id="cisc_first" style="display: block"></p>' +
                '<p id="cisc_second" style="display: none"></p>' +
                '<p id="cisc_third" style="display: none"></p>';

            document.body.insertAdjacentHTML('afterbegin', htmlFirst);
        });

        it('should do nothing with wrong qr-code', function () {
            ciscQrScanned('test');

            expect(document.getElementById("cisc_first").style.display).toBe('block');
            expect(document.getElementById("cisc_second").style.display).toBe('none');
            expect(document.getElementById("cisc_third").style.display).toBe('none');
        });

        it('should move to next phase on valid input', function () {
            ciscQrScanned(validInput);

            expect(document.getElementById("cisc_first").style.display).toBe('none');
            expect(document.getElementById("cisc_second").style.display).toBe('block');
            expect(document.getElementById("cisc_third").style.display).toBe('none');
        });
    });

    describe('ciscPropose_handler', function() {
        beforeEach(function() {

            var html = '<p id="cisc_first" style="display: none"></p>' +
                '<p id="cisc_second" style="display: block"></p>' +
                '<p id="cisc_third" style="display: none"></p>';

            document.body.insertAdjacentHTML('afterbegin', html);
        });

        it('should do nothing with invalid key', function() {

            ciscPropose_handler('');

            expect(document.getElementById("cisc_first").style.display).toBe('none');
            expect(document.getElementById("cisc_second").style.display).toBe('block');
            expect(document.getElementById("cisc_third").style.display).toBe('none');
        });

        it('should move to next phase on valid input', function() {
            ciscPropose_handler('cba3c57a15629fb03e9e49fdd9caa2c0');

            expect(document.getElementById("cisc_first").style.display).toBe('none');
            expect(document.getElementById("cisc_second").style.display).toBe('none');
            expect(document.getElementById("cisc_third").style.display).toBe('block');
        });
    });

    describe('ciscPropose', function() {
        it('should do nothing with invalid key', function(done) {
            var html = '<input id="keyPairName" value="" />';
            document.body.insertAdjacentHTML('afterbegin', html);

            ciscPropose(function(r) {
                expect(r).toEqual('');
                done();
            });
        });

        it('should move to next phase on valid input', function(done) {
            var html = '<input id="keyPairName" value="nome_uniqco" />';
            document.body.insertAdjacentHTML('afterbegin', html);

            ciscPropose(function(res) {
                expect(res.length).toEqual(32);
                done();
            });
        });

        it('should do nothing on duplicate id', function(done) {
            var html = '<input id="keyPairName" value="ciscDuplicate" />';
            document.body.insertAdjacentHTML('afterbegin', html);

            cryptoGenerateAndStore('ciscDuplicate', function(r) {
                ciscPropose(function(r) {
                    expect(r.length).toEqual(0);
                    done();
                });
            });
        });
    });
});