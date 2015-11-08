/**
 * Tests suite for App
 */
describe('LocalizePict.View.Picture', function () {

    beforeAll(function () {
        jasmine.getFixtures().fixturesPath = '..';

        var indexContent = readFixtures('index.html');
        $('body').after($(indexContent).filter('script[type="text/template"]'));
    });

    beforeEach(function () {
        this.error = new LocalizePict.View.Picture({router: new LocalizePict.Router.Router()});
    });

    afterEach(function () {
        // Remove all HTML inserted
        $('main').empty();
    });

    afterAll(function() {
        $('body ~ script[type="text/template"]').remove();
    });

    describe('.render()', function() {
        beforeEach(function() {
            this.picture = new LocalizePict.View.Picture();
            this.pictures = new LocalizePict.Collection.Pictures([
                new LocalizePict.Model.Picture({
                    pid: '1',
                    icon: 'http://myicon1.jpg',
                    picture: 'http://myoriginal1.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '2',
                    icon: 'http://myicon2.jpg',
                    picture: 'http://myoriginal2.jpg',
                    location: {
                        latitude: '40.713509',
                        longitude: '-73.941141',
                    }
                }),
                new LocalizePict.Model.Picture({
                    pid: '3',
                    icon: 'http://myicon3.jpg',
                    picture: 'http://myoriginal3.jpg',
                    location: {
                        latitude: '41.713509',
                        longitude: '-73.941141',
                    }
                })]);
        });

        it('Should render the picture', function() {
            this.picture.render(3, this.pictures);
            expect($('#global-picture').length).toEqual(1);
            expect($('#global-picture-img').length).toEqual(1);
            expect($('#global-picture-list').length).toEqual(0);
            expect($('#global-picture-img img:first-child').attr('src')).toEqual('http://myoriginal3.jpg');
        });

        it('Should show pictures which have the same location', function() {
            this.picture.render(1, this.pictures);
            expect($('#global-picture-list').length).toEqual(1);
        });

        it('Should throw an error if the picture does not exist', function() {
            expect(this.picture.render.bind(null, 4, this.pictures)).toThrow();
        });
    });
});
