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

        // Render the picture
        $('main').append(this.template('tplPicturePage')({
            picture: picture.get('picture'),
            details: {},
            pictures: []
        }));

        return this;
    }
});