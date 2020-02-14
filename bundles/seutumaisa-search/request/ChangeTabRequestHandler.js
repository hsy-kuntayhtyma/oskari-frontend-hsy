/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.request.ChangeTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.request.ChangeTabRequestHandler',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.seutumaisaSearch.Flyout} search
 *          reference to seutumaisaSearch flyout
 */
    function (search) {
        this.search = search;
    }, {
        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.seutumaisaSearch.request.ChangeTabRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.search.changeTab(request.getId());
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
