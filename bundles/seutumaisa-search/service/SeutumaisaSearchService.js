/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.SeutumaisaSearchService
 */
(function (Oskari) {
    Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.SeutumaisaSearchService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox, locale) {
        this.sandbox = sandbox;
        this.locale = locale;

        // attach on, off, trigger functions
        Oskari.makeObservable(this);
    }, {
        __name: 'SeutumaisaSearch.SeutumaisaSearchService',
        __qname: 'Oskari.mapframework.bundle.seutumaisaSearch.SeutumaisaSearchService',

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

            var data = [
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Massan laji',
                    id: 'joku_id'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse2',
                    values: [],
                    cls: 'eka',
                    title: 'Massan ryhmä',
                    id: 'joku_id1'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Kelpoisuusluokka',
                    id: 'joku_id2'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Kohdetyyppi',
                    id: 'joku_id3'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Maamassan tila',
                    id: 'joku_id4'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Omistaja (massan)',
                    id: 'joku_id5'
                },
                {
                    type: 'select',
                    placeholderText: 'Valitse',
                    values: [
                        {
                            id: '1',
                            title: 'eka'
                        },
                        {
                            id: '2',
                            title: 'toka'
                        },
                        {
                            id: '3',
                            title: 'kolmas'
                        },
                        {
                            id: '4',
                            title: 'neljäs'
                        }
                    ],
                    title: 'Kunta',
                    id: 'joku_id6'
                },
                {
                    type: 'range',
                    title: 'Massan määrä',
                    min: 100,
                    max: 200000,
                    id: 'joku_id7'
                },
                {
                    type: 'daterange',
                    title: 'Suunnitteluaikataulu',
                    id: 'joku_id8'
                }
            ];
            handler(null, data);
        },
        search: function (data, handler) {
            if (typeof handler !== 'function') {
                return;
            }

            var responseData = {};
            handler(null, responseData);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));