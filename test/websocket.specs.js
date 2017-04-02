describe('websocket', function() {

    // inject the HTML fixture for the tests
    beforeEach(function() {
        var fixture = '<div id="ws_result">test</div>' +
            '<div id="address">192.33.210.8:7771</div>' +
            '<input id="pin" value="test">';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
    });

    describe('fail', function() {
        it('should print error message', function() {
            fail('');

            var expectedHtml = '<span style="color: red;">ERROR: </span>undefined';

            expect(document.getElementById("ws_result").innerHTML).toEqual(expectedHtml);
        });
    });

    describe('success', function() {
        it('should print success message', function() {
            success('');

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