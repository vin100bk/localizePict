/**
 * Tests suite for Pictures collection
 */
describe('LocalizePict.Collection.Pictures', function () {

    beforeEach(function () {
        spyOn(LocalizePict.View.App.prototype, 'update').and.callThrough();
        this.app = new LocalizePict.View.App();
        this.pictures = this.app.model;
    });

    it('An intiale collection should be empty', function () {
        expect(this.pictures.length).toEqual(0);
    });

    describe('.set()', function() {

        beforeEach(function () {
            this.picturesData = [
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
                })];
        });

        it('Should set new pictures in the collection', function() {
            expect(this.pictures.length).toEqual(0);
            this.pictures.set(this.picturesData);
            expect(this.pictures.length).toEqual(2);
        });

        it('Should trigger an event "set"', function() {
            spyOn(this.pictures, 'trigger');
            this.pictures.set(this.picturesData);
            expect(this.pictures.trigger).toHaveBeenCalledWith('set', jasmine.any(Array));
        });
    });
});