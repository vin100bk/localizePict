/**
 * Represent a collection of pictures
 */
LocalizePict.Collection.Pictures = Backbone.Collection.extend(_.extend(
    LocalizePict.Collection.Provider.Facebook, {
    /** Associated model */
    model: LocalizePict.Model.Picture,

    /**
     * @Override
     * Trigger an event after set operation
     */
    set: function () {
        // @todo: handle duplicates on multiples providers
        LocalizePict.Collection.Pictures.__super__.set.apply(this, arguments);
        this.trigger('set');
    }
}));
