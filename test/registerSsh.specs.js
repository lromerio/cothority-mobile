
describe('registerSsh', function() {

    describe("rsDisplayConodes", function() {

        beforeEach(function () {
            dbOpen();
            var htmlFirst = '<p id="ssh_conodes_list">test</p>';

            document.body.insertAdjacentHTML('afterbegin', htmlFirst);
        });

        it("should display conodes", function(done) {

            // Add new entry to database
            var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

            // Random number as fake address, ID and keypair (must be unique)
            var d = new Date();
            var t = "test" + d.getTime();

            dbAction(sql, [t, t, 'test', t], function () {

                rsDisplayConodes();
                expect(document.getElementById("ssh_conodes_list").value !== 'test').toBeTruthy();

                done();
            });
        });
    });
});
