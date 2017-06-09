
describe('databaseHelper', function() {

    describe('dbOpen', function() {

        it("should open the database", function(done) {
            dbOpen(function () {
                done();
            });
        });
    });

    describe('dbErrorHandler', function() {

        it("should handle error", function() {
            const e = {code: '0', message: 'test'};
            dbErrorHandler(e);
        });
    });

    describe('dbAction', function() {

        it("should insert in conodes", function(done) {

            // Add new entry to database
            var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

            // Random number as fake address, ID and keypair (must be unique)
            var d = new Date();
            var t = "test" + d.getTime();

            dbAction(sql, [t, t, 'test', t], function() {
                done();
            });
        });
    });

});
