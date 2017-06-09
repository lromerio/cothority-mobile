
describe('registerSsh', function() {

    describe("csDisplayConodes", function() {

        beforeEach(function () {
            dbOpen();
            var htmlFirst = '<p id="conodes_list">test</p>';

            document.body.insertAdjacentHTML('afterbegin', htmlFirst);
        });

        it("should display conodes", function(done) {

            // Add new entry to database
            var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

            // Random number as fake address, ID and keypair (must be unique)
            var d = new Date();
            var t = "test" + d.getTime();

            dbAction(sql, [t, t, 'test', t], function () {

                csDisplayConodes();
                expect(document.getElementById("conodes_list").value !== 'test').toBeTruthy();

                done();
            });
        });
    });

    describe("showStatus", function() {

        const MOCK_DATA = {
            "System": "linux/amd64/go1.8.1",
            "Port": "8002",
            "ConnType": "tcp",
            "Version": "1.0",
            "Uptime": "24h53m53.592786702s",
            "RX_bytes": "44846",
            "Host": "192.33.210.8",
            "Description": "Conode_1",
            "Available_Services": "CoSi,Guard,Identity,Skipchain,Status",
            "TX_bytes": "80062"
        };

        const EXPECTED_HTML = "<table><tbody>" +
            "<tr><th>Name</th><td>Conode_1</td></tr>" +
            "<tr><th>IP</th><td>192.33.210.8</td></tr>" +
            "<tr><th>Connection</th><td>tcp</td></tr>" +
            "<tr><th>Port Number</th><td>8002</td></tr>" +
            "<tr><th>Uptime</th><td>24h53</td></tr>" +
            "<tr><th>Traffic [Bps]</th><td>1.39</td></tr>" +
            "<tr><th>Services</th><td>CoSi,Guard,Identity,Skipchain,Status</td></tr>" +
            "<tr><th>Version</th><td>1.0</td></tr>" +
            "</tbody></table>";

        it("should build html string", function() {

            var html = showStatus(MOCK_DATA);

            expect(html).toBe(EXPECTED_HTML);
        })
    });
});
