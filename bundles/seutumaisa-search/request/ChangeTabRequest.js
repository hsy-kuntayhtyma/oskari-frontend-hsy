/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.request.ChangeTabRequest
 * Requests tab to be changed
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.request.ChangeTabRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function (id) {
    this._id = id;
},
{
    /** @static @property __name request name */
    __name: 'SeutumaisaSearch.ChangeTabRequest',

    /**
     * @method getName
     * @return {String} request name
     */
    getName: function () {
        return this.__name;
    },

    /**
     * @method getId
     * @return {String} tabheader id
     */
    getId: function () {
        return this._id;
    }
},
{
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.request.Request']
});