
describe('checkConfig', function() {

    beforeEach(function () {
        dbOpen();
        var htmlFirst = '<p id="state">test</p>' +
            '<p id="updates">test</p>' +
            '<p id="conodes_list">test</p>' +
            '<p id="show_config">test</p>' +
            '<p id="success_msg">test</p>';

        document.body.insertAdjacentHTML('afterbegin', htmlFirst);
    });

    describe("ccDisplayConodes", function() {

        it("should display conodes", function(done) {

            // Add new entry to database
            var sql = "insert into conodes(address, serverId, deviceId, keyPair) values(?,?,?,?)";

            // Random number as fake address, ID and keypair (must be unique)
            var d = new Date();
            var t = "test" + d.getTime();

            dbAction(sql, [t, t, 'test', t], function () {

                ccDisplayConodes();
                expect(document.getElementById("conodes_list").value !== 'test').toBeTruthy();

                done();
            });
        });
    });

    describe("stateCallback", function() {

        it("should update GUI", function() {

            stateCallback();

            expect(document.getElementById("state").style.color).toBe("rgb(0, 140, 186)");
            expect(document.getElementById("updates").style.color).toBe("rgb(153, 153, 153)");
            expect(document.getElementById("conodes_list").style.display).toBe('block');
            expect(document.getElementById("show_config").style.display).toBe('none');
            expect(document.getElementById("success_msg").style.display).toBe('none');
        });
    });

    describe("updatesCallback", function() {

        it("should update GUI", function() {

            updatesCallback();

            expect(document.getElementById("updates").style.color).toBe("rgb(0, 140, 186)");
            expect(document.getElementById("state").style.color).toBe("rgb(153, 153, 153)");
            expect(document.getElementById("conodes_list").style.display).toBe('block');
            expect(document.getElementById("show_config").style.display).toBe('none');
            expect(document.getElementById("success_msg").style.display).toBe('none');
        });
    });

    describe("showConfig", function() {

        const MOCK_CONFIG = {
            "threshold": 2,
            "device": {
                "aPgDeveloper": {
                    "point": hex2buf("c8f2e6394d1f592f04de9a0d6a64394219f980933ded57e14eefd53f48496b19")
                },
                "icsil1-conode1": {
                    "point": hex2buf("367a2c5f9b6cf1df979e8a27af505dc97de62e34d8075ad4f1731a8734dce961")
                }
            },
            "data": {
                "ssh:icsil1-conode1:test": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9YffkNEgfHidbmKkCwkNEKPqHFoSQCYuVDS/UNjKmsASmhNoCSr2XbgIlM09ngjX2nyZWi3MA/cbFMaUy2KGqj0s9fuBM+4LiIV43QOzvU1X9NlFuP4Iaud8VNedR403fbBXVh77zMby51MJuQx1IIdo19NImSZZD1eAGwdyXbVO+GMFSBS18CR35K1DxB83YIs0N8qhKDNjrb5POMrEqH7/SVUvPG94StwYGkJ5U2kpdx0CYg09JZpR4RVEncF7p3hIcEORTroejQohK/ggNjk079FDJbTinC5pjBnMBxp0rYiTRtXcZnoApsuq6Eyz70ujIAOz2YbRHORknnEOv",
                "ssh:aPGD:server": "64293608bc23f08d215742980accdff44a1e04b5abb32b5ede1299827c20a090c7d99fab6af2786902ea849dd62b764ad9747f3dc307038179f1a49013565340"
            }
        };

        const CORRECT_HTML = '<hr><b>Threshold: </b>2<br><br>' +
            '<b>Devices:</b><br>' +
            '<i>aPgDeveloper</i> c8f2e6394d1f592f04de9a0d6a64394219f980933ded57e14eefd53f48496b19<br>' +
            '<i>icsil1-conode1</i> 367a2c5f9b6cf1df979e8a27af505dc97de62e34d8075ad4f1731a8734dce961<br><br>' +
            '<b>Data:</b><br>' +
            '<i>ssh:icsil1-conode1:test</i><br>' +
            '<i>ssh:aPGD:server</i><br>' +
            '<button onclick="voteUpdate()">Vote</button>';

        it("should show Config", function() {
            showConfig(MOCK_CONFIG);

            expect(document.getElementById("conodes_list").style.display).toBe('none');
            expect(document.getElementById("show_config").style.display).toBe('block');
            expect(document.getElementById("show_config").innerHTML).toBe(CORRECT_HTML);
        })

        it("should handle null config", function() {
            updatesCallback();
            showConfig(null);

            expect(document.getElementById("conodes_list").style.display).toBe('none');
            expect(document.getElementById("show_config").style.display).toBe('block');
            expect(document.getElementById("show_config").innerHTML).toBe('<hr>No updates to vote.');
        });
    });
});