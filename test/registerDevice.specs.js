
describe('cisc', function() {
    dbOpen();

    const PREFIX =  'cisc://';
    const ADDR = '192.33.210.8:8003';
    const MOCK_ID = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

    const validInput = PREFIX + ADDR + '/' + MOCK_ID;

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
    });
});