describe('Picture', function () {
    beforeEach(function () {
        this.picture = new Picture({
            provider: {},
            album: 'My first album',
            icon: 'http://myicon.jpg',
            pictures: [{
                width: 10,
                height: 10,
                source: 'http://10x10.jpg'
            }, {
                width: 50,
                height: 100,
                source: 'http://50x100.jpg'
            }, {
                width: 100,
                height: 50,
                source: 'http://100x50.jpg'
            }],
            location: {
                latitude: '40.713509',
                longitude: '-73.941141',
                label: 'Home',
                city: 'Brooklyn',
                country: 'USA'
            },
            label: 'Home sweet home',
            link: 'http://mylink.com',
            date: '1436143423'
        });
    });

    it('should return the album name', function () {
        expect(this.picture.get('album')).toEqual('My first album');
    });

    it('should return the icon URL', function () {
        expect(this.picture.get('icon')).toEqual('http://myicon.jpg');
    });

    it('should return the pictures', function () {
        expect(this.picture.get('pictures').length).toEqual(3);
        expect(this.picture.get('pictures')).toEqual([{
            width: 10,
            height: 10,
            source: 'http://10x10.jpg'
        }, {
            width: 50,
            height: 100,
            source: 'http://50x100.jpg'
        }, {
            width: 100,
            height: 50,
            source: 'http://100x50.jpg'
        }]);
    });

    it('should return the label', function () {
        expect(this.picture.get('label')).toEqual('Home sweet home');
    });

    it('should return the link', function () {
        expect(this.picture.get('link')).toEqual('http://mylink.com');
    });

    it('should return the date', function () {
        expect(this.picture.get('date')).toEqual('1436143423');
    });

    describe('Location', function() {
        beforeEach(function () {
            this.location = this.picture.get('location');
        });

        it('should return the latitude', function () {
            expect(this.location.latitude).toEqual('40.713509');
        });

        it('should return the longitude', function () {
            expect(this.location.longitude).toEqual('-73.941141');
        });

        it('should return the label', function () {
            expect(this.location.label).toEqual('Home');
        });

        it('should return the city', function () {
            expect(this.location.city).toEqual('Brooklyn');
        });

        it('should return the country', function () {
            expect(this.location.country).toEqual('USA');
        });
    });
});
