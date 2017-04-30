describe('sidebar', function() {

    // inject the HTML fixture for the tests
    beforeEach(function() {
        var fixture = '<div id="mySidenav" class="sidenav"><div>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
    });

    describe('openNav', function() {

        it('should open the sidebar', function() {
            openNav();
        });

    });

    // describe('closeNav', function() {
    //
    //     it('should close the sidebar', function() {
    //         closeNav("../www/index.html");
    //     });
    //
    // });
});
