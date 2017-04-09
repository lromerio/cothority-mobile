
describe('databaseHelper', function() {

    var keyPair = 'b2ac29e97e26fdcc45ee7f44481e97398de6f9ea11a8bf0383756afacf56c2f987dad59c84c8b92387bc8f5eb4ddc15a295c086252e13728615807d64fba7865';

    describe('database opened', function() {
        dbOpen();

        describe('dbInsertKeyPair', function () {
            it('should insert a new key', function (done) {
                dbInsertKeyPair('insert', keyPair,
                    function (res) {
                        expect(res).toBeTruthy();
                        done();
                    }
                );
            });

            it('should not insert same key twice', function (done) {
                dbInsertKeyPair('insertTwice', keyPair,
                    function (res) {
                        expect(res).toBeTruthy();
                        dbInsertKeyPair('insertTwice', keyPair,
                            function (res) {
                                expect(res).toBeFalsy();
                                done();
                            }
                        )
                    }
                );
            });

            it('should not insert invalidkey', function (done) {
                dbInsertKeyPair('invalid1', '3024abf',
                    function (res) {
                        expect(res).toBeFalsy();
                        dbInsertKeyPair('invalid2', 'test',
                            function (res) {
                                expect(res).toBeFalsy();
                                done();
                            }
                        )
                    }
                );
            });
        });

        describe('dbContainsKeyPair', function () {
            it('should return false if does not contains the key', function (done) {
                dbContainsKeyPair('notHere', function (res) {
                    expect(res).toBeFalsy();
                    done();
                });
            });

            it('should return true if it contains the key', function (done) {
                dbInsertKeyPair('here', keyPair, function (res) {
                    expect(res).toBeTruthy();
                    dbContainsKeyPair('here', function (res) {
                        expect(res).toBeTruthy();
                        done();
                    })
                });
            });
        });

        describe('dbInsertKeyPair', function () {
            it('should retrieve nothing if does not contain the key', function (done) {
                dbRetrieveKeyPair('retrieve1', function (res) {
                    expect(res.rows.length).toEqual(0);
                    done();
                });
            });

            it('should retrieve the key if it contains it', function (done) {
                dbInsertKeyPair('retrieve2', keyPair, function (res) {
                    expect(res).toBeTruthy();
                    dbRetrieveKeyPair('retrieve2', function (res) {
                        expect(res.rows.length).toEqual(1);
                        done();
                    })
                });
            });
        });


        describe('dbCleanAll', function () {
            it('should delete all keys', function (done) {
                dbInsertKeyPair('clean', keyPair,
                    function (res) {
                        expect(res).toBeTruthy();
                        dbCleanAll(function (res) {
                            expect(res).toBeTruthy();
                            dbRetrieveKeyPair('*', function (res) {
                                expect(res.rows.length).toEqual(0);
                                done();
                            })
                        })
                    }
                );
            });
        });
    });
});
