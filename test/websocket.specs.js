
/*
MOCK_STATUS_RESPONSE = {
    server: {
        address: faker.internet.ip(),
        description: faker.lorem.sentence(),
        id: new Uint8Array([0, 0, 0, 0]),
        public: new Uint8Array([1, 1, 1, 1])
    },
    system: {
        Status: {
            field: {
                test: faker.lorem.sentence()
            }
        }
    }
};

describe('CothorityProtobuf', function() {

    //var messageReceived = false;
    var test = {
        messageReceived: function () {
        }
    };


    beforeEach(function(done) {
        var mockServer = new Server('ws://localhost/Status/Request');
        mockServer.on('message', test.messageReceived);


        var mockErrorServer = new Server('ws://localhost:1/Status/Request');
        mockErrorServer.on('message', function () {
            //messageReceived = true;
        });

        var fixture = '<div id="ws_result">test</div>' +
            '<input id="address" value="localhost">' +
            '<input id="pin" value="test">';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);

        spyOn(test, 'messageReceived');

        getStatus();

        setTimeout(function () {
            done();
        }, 5000);
        //while(!messageReceived) {
            // Wait response
        //}
    });

    it('should create and persist the socket', function () {


        expect(test.messageReceived).toHaveBeenCalled();

    });

});

*/

describe('websocket', function() {

    beforeEach(function() {
        var html = '<div id="ws_result">test</div>' +
            '<div id="address">192.33.210.8:7771</div>' +
            '<input id="pin" value="test">';

        document.body.insertAdjacentHTML(
            'afterbegin',
            html);
    });

    describe('fail', function() {
        it('should print error message', function() {
            callbacks.fail('');

            var expectedHtml = '<span style="color: red;">ERROR: </span>undefined';

            expect(document.getElementById("ws_result").innerHTML).toEqual(expectedHtml);
        });
    });

    describe('success', function() {
        it('should print success message', function() {
            callbacks.success('');

            var expectedHtml = '<span style="color: green;">SUCCESS: </span>undefined';

            expect(document.getElementById("ws_result").innerHTML).toEqual(expectedHtml);
        });
    });

    describe('getStatus', function() {
        it('should request status', function() {
            getStatus();
        });
    });

    describe('pinRequest', function() {
        it('should send a pin request', function() {
            pinRequest();
        });
    });

});