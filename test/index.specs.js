var helper = {
    trigger: function(obj, name) {
        var e = document.createEvent('Event');
        e.initEvent(name, true, true);
        obj.dispatchEvent(e);
    },
    getComputedStyle: function(querySelector, property) {
        var element = document.querySelector(querySelector);
        return window.getComputedStyle(element).getPropertyValue(property);
    }
};

describe('app', function() {
    describe('initialize', function() {
        beforeEach(function(done) {
            spyOn(app, 'onDeviceReady');
            app.initialize();
            helper.trigger(window.document, 'deviceready');
            done();
        });

        it('should bind deviceready', function() {
            expect(app.onDeviceReady).toHaveBeenCalled();
        });
    });

    describe('onDeviceReady', function() {
        it('should report that it fired', function() {
            spyOn(app, 'receivedEvent');
            app.onDeviceReady();
            expect(app.receivedEvent).toHaveBeenCalledWith('deviceready');
        });
    });

    describe('receivedEvent', function() {
        beforeEach(function() {
            var fixture = ['<div id="deviceready">',
                '    <p class="event listening">Listening</p>',
                '    <p class="event received">Received</p>',
                '</div>'].join('\n');

            document.body.insertAdjacentHTML(
                'afterbegin',
                fixture);
        });

        it('should hide the listening element', function() {
            app.receivedEvent('deviceready');
            var displayStyle = helper.getComputedStyle('#deviceready .listening', 'display');
            expect(displayStyle).toEqual('none');
        });

        it('should show the received element', function() {
            app.receivedEvent('deviceready');
            var displayStyle = helper.getComputedStyle('#deviceready .received', 'display');
            expect(displayStyle).toEqual('block');
        });
    });
});