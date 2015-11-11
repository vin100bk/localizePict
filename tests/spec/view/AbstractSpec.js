/**
 * Tests suite for App
 */
describe('LocalizePict.View.Abstract', function () {

    beforeEach(function () {
        var router = new LocalizePict.Router.Router();
        this.app = router.app;
    });

    describe('.template()', function() {
        it('Should return the template associated to the ID', function() {
            expect(this.app.template('tplSpinner')().trim()).toEqual('<div class="spinner-loader spinner"></div>');
        });
    });

    describe('.showError()', function() {
        beforeEach(function() {
            spyOn(this.app, 'closeError');
            this.app.showError('Test');
        });

        it('Should display an error message', function() {
            expect($('#error').length).toEqual(1);
            expect($('#error p:first-child').text()).toEqual('Test');
            expect($('#error .button-submit').length).toEqual(1);
            $('#error .button-submit').trigger('click');
            expect(this.app.closeError).toHaveBeenCalled();
        });
    });

    describe('.closeError', function() {
        beforeEach(function() {
            this.app.showError('Test');
            this.app.closeError();
        });

        it('Should remove the overlay and the error message', function() {
            expect($('#overlay-global').length).toEqual(0);
            expect($('#error').length).toEqual(0);
        });
    });

    describe('.showGlobalOverlay()', function() {
        beforeEach(function() {
            this.app.showGlobalOverlay();
        });

        it('Should add an overlay', function() {
            expect($('#overlay-global').length).toEqual(1);
        });
    });

    describe('.closeGlobalOverlay()', function() {
        beforeEach(function() {
            this.app.showGlobalOverlay();
        });

        it('Should remove the overlay', function() {
            expect($('#overlay-global').length).toEqual(1);
            this.app.closeGlobalOverlay();
            expect($('#overlay-global').length).toEqual(0);
        });
    });
});
