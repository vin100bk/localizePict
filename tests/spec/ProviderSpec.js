/**
 * Tests suite for Provider model
 */
describe('Provider model', function () {

    describe('FacebookProvider', function() {

        describe('.get()', function() {
            beforeEach(function() {
                this.provider = new FacebookProvider();
            });

            it('Should return correct values', function() {
                expect(this.provider.get('id')).toEqual(jasmine.any(String));
                expect(this.provider.get('order')).toEqual(jasmine.any(Number));
                expect(this.provider.get('prefix')).toEqual(jasmine.any(String));
                expect(Object.keys(this.provider.attributes).length).toEqual(3);
            });
        });
    });
});
