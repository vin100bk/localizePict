/**
 * Tests suite for Pictures collection
 */
describe('LocalizePict.Collection.Pictures', function () {

    beforeEach(function () {
        this.pictures = new LocalizePict.Collection.Pictures();
    });

    it('An intiale collection should be empty', function () {
        expect(this.pictures.length).toEqual(0);
    });

    describe('.add()', function () {

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

        it('Should add new pictures in the collection', function () {
            expect(this.pictures.length).toEqual(0);
            this.pictures.add(this.picturesData);
            expect(this.pictures.length).toEqual(2);
        });
    });

    describe('.save()', function () {
        it('Should call .sync()', function () {
            spyOn(this.pictures, 'sync');
            this.pictures.save();
            expect(this.pictures.sync).toHaveBeenCalledWith('update', this.pictures.models);
        });
    });

    describe('.sync()', function () {

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

        describe('read', function () {
            it('Should not call reset without stored data', function () {
                spyOn(this.pictures, 'reset');
                this.pictures.sync('read');
                expect(this.pictures.reset).not.toHaveBeenCalled();
            });
        });

        it('Should save and get pictures', function () {
            expect(this.pictures.length).toEqual(0);
            this.pictures.sync('update', this.picturesData);
            spyOn(this.pictures, 'reset').and.callThrough();
            this.pictures.sync('read');
            expect(this.pictures.reset).toHaveBeenCalledWith(JSON.parse(JSON.stringify(this.picturesData)));
            expect(this.pictures.length).toEqual(2);
        });
    });

    describe('.comparator()', function () {
        beforeEach(function () {
            this.pictures = new LocalizePict.Collection.Pictures();
            this.pictures.add(new LocalizePict.Model.Picture({
                pid: '1',
                icon: 'http://myicon1.jpg',
                picture: 'http://myoriginal1.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                },
                date: '2015-11-13T19:08:25+0000'
            }));
            this.pictures.add(new LocalizePict.Model.Picture({
                pid: '2',
                icon: 'http://myicon2.jpg',
                picture: 'http://myoriginal2.jpg',
                location: {
                    latitude: '40.713509',
                    longitude: '-73.941141',
                },
                date: '2015-11-14T19:08:25+0000'
            }));
        });

        it('Should order pictures by date with a descending order', function() {
            expect(this.pictures.at(0).get('pid')).toEqual('2');
        });
    });
});