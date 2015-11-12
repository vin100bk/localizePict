/**
 * Picture view
 */
LocalizePict.View.Picture = LocalizePict.View.Abstract.extend({
    /** Events */
    events: {

    },

    /**
     * Render the picture
     * @param pictureId: the picture ID
     * @param pictures: pictures model
     * @returns {LocalizePict.View.Picture}
     */
    render: function (pictureId, pictures) {
        // Get the picture
        var picture = pictures.get(pictureId);

        // Check if the picture exists
        if(!picture) {
            throw {
                name: 'PictureException',
                message: 'The picture does not exist.'
            }
        }

        // Providers translation
        var providers = {
            fb: 'Facebook'
        };

        // Render the picture
        $('main').append(this.template('tplPicturePage')({
            picture: picture.get('picture'),
            details: {
                provider: providers[picture.get('provider')],
                album: picture.get('album'),
                location: picture.get('location'),
                label: picture.get('label'),
                link: picture.get('link'),
                date: this.formatDate(new Date(picture.get('date')))
            },
            pictures: []
        }));
        this.setElement($('#global-picture'));

        // Close the view by clicking outside
        this.closeOnClickOutside(['#picture-img > a', '#picture-details', '#picture-list'], function() {
            this.closeGlobalOverlay();
            this.remove();
            this.router.navigate('');
        }.bind(this));

        return this;
    },

    /**
     * Format a date
     * @param date: date object
     * @returns {string}
     */
    formatDate: function(date) {
        return date.getDate()  + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    }
});