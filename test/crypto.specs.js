
describe('crypto', function() {

    beforeEach(function() {
        dbOpen();
    });

    it('should generate new key pair', function(done) {
        dbGenerateAndStoreKeyPair('crypto', function(res) {
            expect(res.length).toEqual(32);
            done();
        });
    });

    it('should generate new key pair', function(done) {
        dbGenerateAndStoreKeyPair('crypto', function(res) {
            expect(res.length).toEqual(0);
            done();
        });
    });
});
