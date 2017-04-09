describe('utils', function() {
    describe('hex2buf', function() {

        it('should convert to buf', function() {
            const buf = hex2buf('01000f');
            expect(buf.toString()).toEqual('1,0,15');
        });

        it('should return empty buf on invalid hex', function() {
            const buf1 = hex2buf('012');
            const buf2 = hex2buf('01g3');

            expect(buf1.toString()).toEqual('');
            expect(buf2.toString()).toEqual('');
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
        const addr = '192.33.210.8:8003';
        const skipchain = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

        const validInput = prefix + addr + '/' + skipchain;

        it('should extract address', function() {
            const res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[0]).toEqual(addr);
        });

        it('should extract skipchainId', function() {
            const res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[1]).toEqual(skipchain);
        });

        describe('Bad input', function() {

            it('should return empty array with wrong prefix', function () {
                const res = extractId('test://' + addr + '/' + skipchain);

                expect(res.length).toEqual(0);
            });

            it('should return empty array without address', function () {
                const res = extractId(prefix + skipchain);

                expect(res.length).toEqual(0);
            });

            it('should return empty array without skipchain id', function () {
                const res = extractId(prefix + addr + '/');

                expect(res.length).toEqual(0);
            });

            it('should return empty array with extra info', function () {
                const res = extractId(validInput + '/' + addr);

                expect(res.length).toEqual(0);
            });

            it('should return empty array with wrong skipchain_id/address', function () {
                const res = extractId(prefix + skipchain + '/' + addr);

                expect(res.length).toEqual(0);
            });

            it('should return empty array with malformed address', function () {
                const res1 = extractId(prefix + '192.33.210.8:80037' + '/' + skipchain);
                const res2 = extractId(prefix + '192.33.210.8.9:8003' + '/' + skipchain);
                const res3 = extractId(prefix + '192.33.2a0.8:8003' + '/' + skipchain);
                const res4 = extractId(prefix + '192.33.210.123.8:8003' + '/' + skipchain);
                const res5 = extractId(prefix + '192.33.210.123.8:80-3' + '/' + skipchain);
                const res6 = extractId(prefix + '192.33.210.8' + '/' + skipchain);


                expect(res1.length).toEqual(0);
                expect(res2.length).toEqual(0);
                expect(res3.length).toEqual(0);
                expect(res4.length).toEqual(0);
                expect(res5.length).toEqual(0);
                expect(res6.length).toEqual(0);
            });

            it('should return empty array with malformed skipchain', function () {
                const res1 = extractId(prefix + addr + '/' +
                    '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c');  // length 63
                const res2 = extractId(prefix + addr + '/' +
                    '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fg03e9e49fdd9caa2c0'); // invalid char (g)


                expect(res1.length).toEqual(0);
                expect(res2.length).toEqual(0);
            });
        });
    });
});
