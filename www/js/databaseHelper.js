"use strict";

var db = window.openDatabase("cothority_database", "1.0", "cothority_database", 1000000);

var ready;

var dbCallbacks = {

    dbErrorHandler: function (e) {
        alert('Database error: ' + e.message);
    },

    dbShowMessage: function (m) {
        alert(m);
    },

    dbReady: function () {
        ready = true;
    }
}

/**
 * Open the database.
 */
function dbOpen() {
    db.transaction(dbSetup, dbCallbacks.dbErrorHandler, dbCallbacks.dbReady);
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
        if (ready) {
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
            dbCallbacks.dbShowMessage("Database not ready yet");
            handler(false);
        }
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
    if (ready) {
        db.transaction(function (tx) {
            var sql = "select K.keyPair from key K where K.name = ?";
            tx.executeSql(sql, [name], function (tx, result) {
                handler(result.rows.length === 1);
            }, dbCallbacks.dbErrorHandler);
        }, dbCallbacks.dbErrorHandler, function () {});
    } else {
        dbCallbacks.dbShowMessage("Database not ready yet");
        handler(false);
    }
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
    if (ready) {
        db.transaction(function (tx) {
            var sql = "select K.keyPair from key K where K.name = ?";
            tx.executeSql(sql, [name], function (tx, result) {
                handler(result);
            }, dbCallbacks.dbErrorHandler);
        }, dbCallbacks.dbErrorHandler, function () {});
    } else {
        dbCallbacks.dbShowMessage("Database not ready yet");
        handler(false);
    }
}

/**
 * Delete the whole database.
 * Once the operation is completed the handler function, received as
 * a parameter, is called.
 *
 * @param handler
 */
function dbCleanAll(handler) {
    if (ready) {
        db.transaction(
            function (tx) {
                var sql = "delete from key";
                tx.executeSql(sql);
            }, dbCallbacks.dbErrorHandler, function() {
                handler(true);
            }
        );
    } else {
        dbCallbacks.dbShowMessage("Database not ready yet");
        handler(false);
    }
}