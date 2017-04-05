describe('crypto', function() {
    describe('generateKeyPair', function() {

        it('should generate buf', function() {
            const buf = generateKeyPair(false);
            expect(buf.length).toEqual(32);
        });

        it('should generate hex', function() {
            const hex = generateKeyPair(true);
            expect(hex.toString().length).toEqual(64);
        });

    });
});
