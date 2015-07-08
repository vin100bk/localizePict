/**
 * Represent a picture
 */
var Picture = Backbone.Model.extend({
    /**
     * Default values
     */
    defaults: {
        'provider':     null,
        'album':        null,
        'label':        null,
        'link':         null,
        'date':         null,
        // Mandatory fields so should not need to define default values but it's more clean
        'icon':         null,
        'pictures':     [],
        'location':     null,
    },

    /**
     * Returns the biggest picture from all pictures availables
     * @return the biggest picture from all pictures availables
     */
    getBiggest: function() {
        var pictures = this.get('pictures');
        if(pictures.length == 0) {
            // If there is no pictures available
            return null;
        }

        var picture = pictures[0];
        for(var i = 1; i < pictures.length; i++) {
            if(pictures[i].width > picture.width) {
                picture = pictures[i];
            }
        }

        return picture;
    }
});