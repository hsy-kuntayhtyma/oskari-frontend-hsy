/**
 * @class Oskari.hsy.bundle.seutumassa-landmass-tool.SeutumassaLandmassToolService
 */
 (function (Oskari) {
    Oskari.clazz.define('Oskari.hsy.bundle.seutumassa-landmass-tool.SeutumassaLandmassToolService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox, locale) {
        this.sandbox = sandbox;
        this.locale = locale;

        // attach on, off, trigger functions
        Oskari.makeObservable(this);
        this.cache = {};
    }, {
        __name: 'seutumassa-landmass-tool.SeutumassaLandmassToolService',
        __qname: 'Oskari.hsy.bundle.seutumassa-landmass-tool.SeutumassaLandmassToolService',

        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        getSearchFields: function (handler) {
            if (typeof handler !== 'function') {
                return;
            }

            if (this.cache['searchFields']) {
                handler(null,this.cache['searchFields']);
                return;
            }
            if(Cookies.getJSON('searchFields')) {
                handler(null, Cookies.getJSON('searchFields'));
                return;
            }

            jQuery.ajax({
                type: 'GET',
                dataType: 'json',

                url: Oskari.urls.getRoute('GetSeutumaisaSearchFields'),
                success: function (pResp) {
                    this.cache['searchFields'] = pResp;
                    Cookies.set('searchFields', pResp);
                    handler(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });


        },
        search: function (data, handler) {
            if (typeof handler !== 'function') {
                return;
            }

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    params: JSON.stringify(data)
                },
                url: Oskari.urls.getRoute('SeutumaisaSearch'),
                success: function (pResp) {
                    handler(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));