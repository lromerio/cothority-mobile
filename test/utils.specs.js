describe('utils', function() {
    describe('hex2buf', function() {

        it('should convert to buf', function() {
            const buf = hex2buf('01-00-0F');
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
            expect(hex).toEqual('10-00-0F');
        });

    })
});
