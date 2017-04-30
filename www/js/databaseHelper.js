"use strict";

var db = window.openDatabase("cothority_database", "1.0", "cothority_database", 1000000);

var dbCallbacks = {

    dbErrorHandler: function (e) {
        alert('Database error: ' + e.message);
    },

    dbShowMessage: function (m) {
        alert(m);
    }
};

/**
 * Open the database, once the db is ready the handler passed as parameter will be triggered.
 *
 * @param handler
 */
function dbOpen(handler) {
    db.transaction(dbSetup, dbCallbacks.dbErrorHandler, handler);
}

/**
 * Create tables if they don't exist yet. Ideally, in a given device, they will be created
 * only the very first time the application is launched.
 *
 * @param tx
 */
function dbSetup(tx) {
    var sql = "create table if not exists key(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, keyPair TEXT)";
    tx.executeSql(sql);
}

/**
 * Insert a new key pair into the database.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param name
 * @param keyPair
 * @param handler
 */
function dbInsertKeyPair(name, keyPair, handler) {

    if (keyPair.match(/[0-9|a-f]{128}/)) {
        dbContainsKeyPair(name, function(res) {
            if(!res) {
                db.transaction(
                    function (tx) {
                        var sql = "insert into key(name, keyPair) values(?,?)";
                        tx.executeSql(sql, [name, keyPair]);
                    }, dbCallbacks.dbErrorHandler, function () {
                        handler(true);
                    }
                );
            } else {
                dbCallbacks.dbShowMessage('The key pair - ' + name + ' - already exists.');
                handler(false);
            }
        });
    } else {
        dbCallbacks.dbShowMessage("Invalid key pair");
        handler(false);
    }
}

/**
 * Verify whether a key pair associated with the given name exists into the database or not.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param name
 * @param handler
 */
function dbContainsKeyPair(name, handler) {
    db.transaction(function (tx) {
        var sql = "select K.keyPair from key K where K.name = ?";
        tx.executeSql(sql, [name], function (tx, result) {
            handler(result.rows.length === 1);
        }, dbCallbacks.dbErrorHandler);
    }, dbCallbacks.dbErrorHandler, function () {});
}

/**
 * Retrieve the key pair associated with the given name.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param name
 * @param handler
 */
function dbRetrieveKeyPair(name, handler) {
    db.transaction(function (tx) {
        var sql = "select K.keyPair from key K where K.name = ?";
        tx.executeSql(sql, [name], function (tx, result) {
            handler(result);
        }, dbCallbacks.dbErrorHandler);
    }, dbCallbacks.dbErrorHandler, function () {});
}

/**
 * Retrieve the whole key table.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param handler
 */
function dbRetrieve(sql, arg, handler) {

    db.transaction(function (tx) {
        tx.executeSql(sql, arg, function (tx, result) {
            handler(result);
        }, dbCallbacks.dbErrorHandler);
    }, dbCallbacks.dbErrorHandler, function () {});
}

/**
 * Delete the whole database.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param handler
 */
function dbCleanAll(handler) {
    db.transaction(
        function (tx) {
            var sql = "delete from key";
            tx.executeSql(sql);
        }, dbCallbacks.dbErrorHandler, function() {
            handler(true);
        }
    );
}

/**
 * Generate a new key pair, store it in the database and return the public key.
 * The key pair is identified by 'keyName'.
 *
 * @param keyName
 * @returns {*}
 */
function dbGenerateAndStoreKeyPair(keyName, handler) {
    dbContainsKeyPair(keyName, function(res) {

        if (!res) {
            var keyPair = cryptoJS.keyPair();
            var pubKey = cryptoJS.publicKey(keyPair);
            var hexKeyPair = buf2hex(keyPair);

            dbInsertKeyPair(keyName, hexKeyPair, function(done) {
                if (done) {
                    return handler(pubKey);
                } else {
                    return handler([]);
                }
            });
        } else {
            alert('Key pair ID already used.');
            return handler([]);
        }
    });
}