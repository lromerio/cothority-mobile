describe('websocket', function() {

    const addr = '192.33.210.8:8003';

    describe('getStatus', function() {
        it('should callback success', function(done) {
            getStatus(addr, function(e){}, function(){
                done();
            });
        });

        it('should callback error', function(done) {
            getStatus('invalid address', function(e) {
                done();
            }, function(){});
        });
    });

    describe('configUpdate', function() {
        it('should send ConfigUpdate', function() {
            configUpdate('test', 'test');
        });

        it('should callback error', function(done) {
            configUpdate('invalid address', null, function(e) {
                done();
            }, function(){});
        });
    });

    describe('proposeUpdate', function() {
        it('should send ProposeUpdate', function() {
            proposeUpdate('test', 'test');
        });

        it('should callback error', function(done) {
            proposeUpdate('invalid address', null, function(e) {
                done();
            }, function(){});
        });
    });

    describe('proposeSend', function() {
        it('should send ProposeSend', function() {
            proposeSend('test', 'test');
        });

        it('should callback error', function(done) {
            proposeSend('invalid address', null, function(e) {
                done();
            }, function(){});
        });
    });

    describe('proposeVote', function() {
        it('should send ProposeVote', function() {
            proposeVote('test', 'test');
        });

        it('should callback error', function(done) {
            proposeVote('invalid address', null, function(e) {
                done();
            }, function(){});
        });
    });
});