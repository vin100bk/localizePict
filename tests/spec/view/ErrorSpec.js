/**
 * Tests suite for App
 */
describe('LocalizePict.View.Error', function () {

    beforeEach(function () {
        this.error = new LocalizePict.View.Error({router: new LocalizePict.Router.Router()});
    });

    describe('.render()', function() {
        it('Should render the error', function() {
            this.error.render('Title', 'Message');
            expect($('#global-error').length).toEqual(1);
            expect($('#global-error h1').text()).toEqual('Title');
            expect($('#global-error p').first().text()).toEqual('Message');
        });
    });

    describe('.render404()', function() {
        it('Should call .render()', function() {
            spyOn(this.error, 'render');
            this.error.render404();
            expect(this.error.render).toHaveBeenCalled();
        });
    });
});
