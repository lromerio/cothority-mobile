describe('utils', function() {
    describe('hex2buf', function() {

        it('should convert to buf', function() {
            const buf = hex2buf('01000f');
            expect(buf.toString()).toEqual('1,0,15');
        });

        it('should return empty buf on invalid hex', function() {
            const buf = hex2buf('012');
            expect(buf.toString()).toEqual('');
        });

    });

    describe('buf2hex', function() {

        it('should convert to hex', function() {
            const hex = buf2hex(new Uint8Array([16, 0, 15]));
            expect(hex).toEqual('10000f');
        });

    });

    describe('extractId', function() {

        const prefix =  'cisc://';
        const addr = '192.33.210.8:8002';
        const skipchain = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

        const validInput = prefix + addr + '/' + skipchain;

        it('should extract address', function() {
            let res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[0]).toEqual(addr);
        });

        it('should extract skipchainId', function() {
            let res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[1]).toEqual(skipchain);
        });

        it('should return empty array with wrong prefix', function() {
            let res = extractId('test://' + addr + '/' + skipchain);

            expect(res.length).toEqual(0);
        });

        it('should return empty array without address', function() {
            let res = extractId(prefix + skipchain);

            expect(res.length).toEqual(0);
        });

        it('should return empty array without skipchain id', function() {
            let res = extractId(prefix + addr + '/');

            expect(res.length).toEqual(0);
        });

        it('should return empty array with extra info', function() {
            let res = extractId(validInput + '/' + addr);

            expect(res.length).toEqual(0);
        });

        it('should return empty array with wrong skipchain_id/address', function() {
            let res = extractId(prefix + skipchain + '/' + addr);

            expect(res.length).toEqual(0);
        });
    });
});
