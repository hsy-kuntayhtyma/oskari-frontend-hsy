/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.request.AddTabRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.request.AddTabRequestHandler',
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
     * @param {Oskari.mapframework.bundle.seutumaisaSearch.request.AddTabRequest} request
     *      request to handle
     */
        handleRequest: function (core, request) {
            this.search.addTab({ 'title': request.getTitle(), 'content': request.getContent(), 'priority': request.getPriority(), 'id': request.getId() });
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
