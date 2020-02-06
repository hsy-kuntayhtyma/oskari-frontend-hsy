/**
 * @class Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService
 */
(function (Oskari) {
    Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService',

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
        __name: 'SeutumaisaHistorySearch.SeutumaisaHistorySearchService',
        __qname: 'Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService',

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
        getHistorySearchFields: function (handler) {
            if (typeof handler !== 'function') {
                return;
            }

            if (this.cache['historySearchFields']) {
                handler(null,this.cache['historySearchFields']);
                return;
            }
            if(Cookies.getJSON('historySearchFields')) {
                handler(null, Cookies.getJSON('historySearchFields'));
                return;
            }

            jQuery.ajax({
                type: 'GET',
                dataType: 'json',

                url: Oskari.urls.getRoute('GetSeutumaisaHistorySearchFields'),
                success: function (pResp) {
                    this.cache['historySearchFields'] = pResp;
                    Cookies.set('historySearchFields', pResp);
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
                url: Oskari.urls.getRoute('SeutumaisaHistorySearch'),
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