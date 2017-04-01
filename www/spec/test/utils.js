describe('utils', function() {
    describe('hex & buf', function() {

        it('should convert to buf', function() {

            const buf = hex2buf('01-00-0F');
            expect(buf.toString()).toEqual('1,0,15');
        });

        it('should convert to hex', function() {

            const hex = buf2hex(new Uint8Array([1, 0, 15]));
            expect(hex).toEqual('01-00-0F');
        });
    });
});
