/**
 * Tests suite for App
 */
describe('LocalizePict.View.Map', function () {

    beforeEach(function () {
        spyOn(LocalizePict.View.Map.prototype, 'addFbPictures').and.callThrough();
        spyOn(LocalizePict.View.Map.prototype, 'closeNotices').and.callThrough();

        this.picturesData = [
            new LocalizePict.Model.Picture({
                pid: '1',
                provider: 'fb',
                icon: 'http://myicon1.jpg',
                picture: 'http://myoriginal1.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            }),
            new LocalizePict.Model.Picture({
                pid: '2',
                provider: 'fb',
                icon: 'http://myicon2.jpg',
                picture: 'http://myoriginal2.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                }
            }),
            new LocalizePict.Model.Picture({
                pid: '3',
                provider: 'fb',
                icon: 'http://myicon3.jpg',
                picture: 'http://myoriginal3.jpg',
                location: {
                    latitude: '41.713509',
                    longitude: '-73.941141',
                }
            }),
            new LocalizePict.Model.Picture({
                pid: '4',
                provider: 'fb',
                icon: 'http://myicon4.jpg',
                picture: 'http://myoriginal4.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941142',
                }
            }),
            new LocalizePict.Model.Picture({
                pid: '5',
                provider: 'fb',
                icon: 'http://myicon5.jpg',
                picture: 'http://myoriginal5.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941142',
                }
            })];

        var router = new LocalizePict.Router.Router();
        this.app = router.app;
    });

    describe('.render()', function () {
        it('Should insert HTML in the page', function () {
            this.app.render();
            expect($('#global').length).toEqual(1);
        });

        it('Should call .initMap()', function () {
            spyOn(this.app, 'initMap');
            this.app.render();
            expect(this.app.initMap).toHaveBeenCalled();
        });
    });

    describe('.isRendered()', function() {
        it('Should return true when the application is rendered', function() {
            this.app.render();
            expect(this.app.isRendered()).toBe(true);
        });

        it('Should return false when the application is not rendered', function() {
            expect(this.app.isRendered()).toBe(false);
        });
    });

    describe('.initMap()', function () {

        it('Should insert the Google Map', function () {
            spyOn(google.maps, 'Map');
            this.app.render();
            expect(google.maps.Map).toHaveBeenCalled();
        });
    });

    describe('.update()', function() {
        beforeEach(function() {
            spyOn(this.app, 'populateMap');
            spyOn(this.app.model, 'save');
            this.app.update();
        });

        it('Should call .populateMap()', function() {
            expect(this.app.populateMap).toHaveBeenCalled();
        });

        it('Should save pictures', function() {
            expect(this.app.model.save).toHaveBeenCalled();
        });
    });

    describe('.populateMap()', function () {
        beforeEach(function () {
            var pictures = new LocalizePict.Collection.Pictures(this.picturesData);

            /**
             * Spies
             */
            this.marker = {
                setTitle: function () {
                }
            };
            spyOn(google.maps, 'Marker').and.returnValue(this.marker);
            spyOn(this.app, 'showPreview');
            spyOn(this.app, 'hidePreview');
            spyOn(this.app, 'goToPicture');

            this.app.render();
            this.app.populateMap(pictures);
        });

        it('Should create a new marker only for pictures with a different location', function () {
            expect(google.maps.Marker.calls.count()).toEqual(3);
        });

        it('Should show preview when mouse hovering', function () {
            expect(this.app.showPreview).not.toHaveBeenCalled();
            google.maps.event.trigger(this.marker, 'mouseover');
            expect(this.app.showPreview).toHaveBeenCalled();
            var firstArgs = this.app.showPreview.calls.argsFor(0)[0];
            expect($.isArray(firstArgs)).toBe(true);
            expect(firstArgs.length).toEqual(2);
        });

        it('Should hide preview when mouse outing', function () {
            expect(this.app.hidePreview).not.toHaveBeenCalled();
            google.maps.event.trigger(this.marker, 'mouseout');
            expect(this.app.hidePreview).toHaveBeenCalled();
        });

        it('Should display the picture when clicking onto', function () {
            expect(this.app.goToPicture).not.toHaveBeenCalled();
            google.maps.event.trigger(this.marker, 'click');
            expect(this.app.goToPicture).toHaveBeenCalled();
            var firstArgs = this.app.goToPicture.calls.argsFor(0)[0];
            expect($.isArray(firstArgs)).toBe(true);
            expect(firstArgs.length).toEqual(2);
        });
    });

    describe('.showPreview()', function () {
        beforeEach(function () {
            this.app.render();
        });

        it('Should preview pictures', function () {
            expect($('#preview').length).toEqual(1);
            expect($('#preview').hasClass('hidden')).toBe(true);
            this.app.showPreview(this.picturesData);
            expect($('#preview').hasClass('hidden')).toBe(false);
            expect($('#preview').children().length).toEqual(5);

        });
    });

    describe('.hidePreview()', function () {
        beforeEach(function () {
            this.app.render();
            this.app.showPreview(this.picturesData);
        });

        it('Should hide the preview', function () {
            expect($('#preview').hasClass('hidden')).toBe(false);
            this.app.hidePreview();
            expect($('#preview').hasClass('hidden')).toBe(true);
        });
    });

    describe('.goToPicture()', function() {
        it('Should navigate to the first picture page', function() {
            spyOn(this.app.router, 'navigate');
            this.app.goToPicture(this.picturesData);
            expect(this.app.router.navigate).toHaveBeenCalledWith('picture/fb_1', jasmine.any(Object));
        });
    });

    describe('.showProviderOptions()', function() {
        beforeEach(function() {
            this.app.render();
            this.elemt = $('#add-pict-fb');
        });

        it('Should create the provider options on the first call', function() {
            expect($('.providerOpts').length).toEqual(0);
            this.app.showProviderOptions(this.elemt);
            expect($('.providerOpts').length).toEqual(1);
        });

        it('Should toggle options on next calls', function() {
            this.app.showProviderOptions(this.elemt);
            this.app.showProviderOptions(this.elemt);
            expect($('.providerOpts').hasClass('hidden')).toBe(true);
            this.app.showProviderOptions(this.elemt);
            expect($('.providerOpts').hasClass('hidden')).toBe(false);
        });
    });

    describe('.initProviderButtons()', function() {
        it('Should set button as active if there is data for a provider', function() {
            this.app.render();
            this.app.initProviderButtons();
            expect($('#add-pict-fb').hasClass('active')).toBe(false);
            this.app.model.sync('update', this.picturesData);
            this.app.render();
            this.app.initProviderButtons();
            expect($('#add-pict-fb').hasClass('active')).toBe(true);
        });
    });

    describe('.addFbPictures()', function () {
        beforeEach(function () {
            this.deferred = $.Deferred();

            /**
             * Spies
             */
            spyOn(this.app.model, 'addFromFb').and.returnValue(this.deferred);
            spyOn(this.app, 'addNotice');
            spyOn(this.app, 'removeOverlayNotices');
            spyOn(this.app, 'addCloseButtonToNotices');
            spyOn(this.app, 'closeNotices');
            spyOn(this.app, 'addOverlayNotices');
            spyOn(this.app, 'showError');

            this.app.render();
            $('#add-pict-fb').trigger('click');
        });

        it('Should initiate notices', function() {
            expect(this.app.closeNotices).toHaveBeenCalled();
            expect(this.app.addOverlayNotices).toHaveBeenCalled();
        });

        it('Should execute .addFromFb() model function', function () {
            expect(this.app.model.addFromFb).toHaveBeenCalled();
        });

        it('Should show notices when progressing', function() {
            this.deferred.notifyWith(this.app, ['test']);
            expect(this.app.addNotice).toHaveBeenCalledWith('test');
        });

        it('Should validate the process when it is resolved', function () {
            this.deferred.resolveWith(this.app, ['test']);
            expect(this.app.removeOverlayNotices).toHaveBeenCalled();
            expect(this.app.addNotice).toHaveBeenCalledWith('test');
            expect(this.app.addCloseButtonToNotices).toHaveBeenCalled();
            expect($('#add-pict-fb').hasClass('active')).toBe(true);
        });

        it('Should show an error when the process fail', function () {
            this.deferred.rejectWith(this.app, [{name: 'MyError', message: 'MyMessage'}]);
            expect(this.app.removeOverlayNotices).toHaveBeenCalled();
            expect(this.app.showError).toHaveBeenCalledWith('MyMessage<br />We are sorry for the inconvenience, please try again later.');
        });

        it('Should show provider options if pictures are already added', function() {
            this.deferred.resolveWith(this.app, ['test']);
            spyOn(this.app, 'showProviderOptions');
            $('#add-pict-fb').trigger('click');
            expect(this.app.showProviderOptions).toHaveBeenCalledWith($('#add-pict-fb'));
        });
    });

    describe('.addNotice()', function() {
        beforeEach(function() {
            this.app.render();
        });

        it('Should add a notice', function() {
            expect($('#notices').children().length).toEqual(0);
            this.app.addNotice('Notice1');
            expect($('#notices').children().length).toEqual(1);
            this.app.addNotice('Notice2');
            expect($('#notices').children().length).toEqual(2);
        });
    });

    describe('.addCloseButtonToNotices()', function() {
        beforeEach(function() {
            this.app.render();
        });

        it('Should add the button', function() {
            expect($('#notices-close').length).toEqual(0);
            this.app.addCloseButtonToNotices();
            expect($('#notices-close').length).toEqual(1);
        });

        it('Should call .closeNotices() when clicking onto', function() {
            this.app.addCloseButtonToNotices();
            $('#notices-close').trigger('click');
            expect(LocalizePict.View.Map.prototype.closeNotices).toHaveBeenCalled();
        });
    });

    describe('.closeNotices()', function() {
        beforeEach(function() {
            this.app.render();
            this.app.addNotice('Notice1');
            this.app.addNotice('Notice2');
        });

        it('Should remove all notices and hide the block', function() {
            this.app.closeNotices();
            expect($('#notices').hasClass('hidden')).toBe(true);
            expect($('#notices').children().length).toEqual(0);
        });
    });

    describe('.addOverlayNotices()', function() {
        beforeEach(function() {
            this.app.render();
        });

        it('Should insert an overlay over notices', function() {
            expect($('#overlay-notices').length).toEqual(0);
            this.app.addOverlayNotices();
            expect($('#overlay-notices').length).toEqual(1);
        });
    });

    describe('.removeOverlayNotices()', function() {
        beforeEach(function() {
            this.app.render();
            this.app.addOverlayNotices();
        });

        it('Should remove the notices overlay', function() {
            this.app.removeOverlayNotices();
            expect($('#overlay-notices').length).toEqual(0);
        });
    });

    describe('.removePicts()', function() {
        beforeEach(function () {
            var pictures = new LocalizePict.Collection.Pictures(this.picturesData);

            this.app.render();
            this.app.populateMap(pictures);
            this.app.showProviderOptions($('#add-pict-fb'));

            spyOn(this.app.model, 'removeProvider');
            this.element = $('.remove-picts').first();
            this.element.trigger('click');
        });

        it('Should call .removeProvider() on the model', function() {
            expect(this.app.model.removeProvider).toHaveBeenCalledWith('fb');
        });

        it('Should hide provider options', function() {
            expect(this.element.parent().hasClass('hidden')).toBe(true);
        });

        it('Should make the add button as inactive', function() {
            expect(this.element.parent().prev().hasClass('active')).toBe(false);
        });
    });
});
