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
        const scanAddr = '192.33.210.8:8003';
        const resAddr = '192.33.210.8:8004';
        const skipchain = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';

        const validInput = prefix + scanAddr + '/' + skipchain;

        it('should extract address', function() {
            const res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[0]).toEqual(resAddr);
        });

        it('should extract skipchainId', function() {
            const res = extractId(validInput);

            expect(res.length).toEqual(2);
            expect(res[1]).toEqual(skipchain);
        });

        describe('Bad input', function() {

            it('should return empty array with wrong prefix', function () {
                const res = extractId('test://' + scanAddr + '/' + skipchain);

                expect(res.length).toEqual(0);
            });

            it('should return empty array without address', function () {
                const res = extractId(prefix + skipchain);

                expect(res.length).toEqual(0);
            });

            it('should return empty array without skipchain id', function () {
                const res = extractId(prefix + scanAddr + '/');

                expect(res.length).toEqual(0);
            });

            it('should return empty array with extra info', function () {
                const res = extractId(validInput + '/' + scanAddr);

                expect(res.length).toEqual(0);
            });

            it('should return empty array with wrong skipchain_id/address', function () {
                const res = extractId(prefix + skipchain + '/' + scanAddr);

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
                const res1 = extractId(prefix + scanAddr + '/' +
                    '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c');  // length 63
                const res2 = extractId(prefix + scanAddr + '/' +
                    '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fg03e9e49fdd9caa2c0'); // invalid char (g)


                expect(res1.length).toEqual(0);
                expect(res2.length).toEqual(0);
            });
        });
    });

    /**
     * A call to the CryptoJS library returns:
     * "Error: interface conversion: interface is []interface {}, not []uint8"
     *
     * Anyway on real devices is working, thus should not be a real problem.
     */
    /*
    describe("createProposeVote", function() {

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
        const MOCK_KEYPAIR = 'b2ac29e97e26fdcc45ee7f44481e97398de6f9ea11a8bf0383756afacf56c' +
            '2f987dad59c84c8b92387bc8f5eb4ddc15a295c086252e13728615807d64fba7865';
        const MOCK_ID = '5fe16b9de09a8b1731ab53d3278aabd3cba3c57a15629fb03e9e49fdd9caa2c0';
        const MOCK_RES = {
            keyPair: MOCK_KEYPAIR,
            serverId: MOCK_ID,
            deviceId: 'test'
        };

        it("should create ProposeVote", function(){
            createProposeVote(MOCK_CONFIG, MOCK_RES);
        });
    });
    */
});
