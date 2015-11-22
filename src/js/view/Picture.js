/**
 * Picture view
 */
LocalizePict.View.Picture = LocalizePict.View.Abstract.extend({
    /** Events */
    events: {},

    /**
     * Render the picture
     * @param pictureId: the picture ID
     * @param pictures: pictures collection
     * @returns {LocalizePict.View.Picture}
     */
    render: function (pictureId, pictures) {
        // Get the picture
        var picture = pictures.get(pictureId);

        // Check if the picture exists
        if (!picture) {
            throw {
                name: 'PictureException',
                message: 'The picture does not exist.'
            }
        }

        // Remove the potential previous picture
        if($('#global-picture').length > 0) {
            $('#global-picture').remove();
            $(document).off('keydown');
        }

        // Get pictures with same location
        var location = picture.get('location');
        var sameLocationPicts = pictures.getByLocation(location.latitude, location.longitude);

        // Prev and next
        var prev;
        var next;
        if(sameLocationPicts.length > 1) {
            var index = sameLocationPicts.indexOf(picture);
            if(index > 0) {
                prev = sameLocationPicts.at(index - 1).get('id');
            }

            if(index < sameLocationPicts.length - 1) {
                next = sameLocationPicts.at(index + 1).get('id');
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
            pictures: sameLocationPicts,
            prev: prev,
            next: next
        }));
        this.setElement($('#global-picture'));

        // Close the view by clicking outside
        this.closeOnClickOutside(['#picture-img > a', '#picture-details', '#picture-list', '#picture-prev', '#picture-next'], function () {
            this.closeGlobalOverlay();
            this.remove();
            this.router.navigate('');
        }.bind(this));

        // Init the picture list
        this.initPictureList(picture, sameLocationPicts);

        return this;
    },

    /**
     * Format a date
     * @param date: date object
     * @returns {string}
     */
    formatDate: function (date) {
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    },

    /**
     * Init list of pictures which are in the same location
     * @param picture: current picture
     * @param pictures: pictures collection
     */
    initPictureList: function (picture, pictures) {
        // Prev and next
        $(document).keydown(function (e) {
            if (e.which == 37 && index > 0) {
                // Prev
                this.router.navigate('#picture/' + pictures.at(index - 1).get('id'), {trigger: true});
            } else if (e.which == 39 && index < pictures.length - 1) {
                // Next
                this.router.navigate('#picture/' + pictures.at(index + 1).get('id'), {trigger: true});
            }
        }.bind(this));

        if (pictures.length > 1) {
            var index = pictures.indexOf(picture);

            // Hover
            var list = $('#picture-list');
            var listHeight = list.css('max-height');
            list.hover(function() {
                $(this).css('max-height', '50%');
            }, function() {
                $(this).css('max-height', listHeight);
            });

            // Active current picture
            $('#picture-list .picture-list-item a[href="#picture/' + picture.get('id') + '"]').parent().addClass('active');
        }
    }
});