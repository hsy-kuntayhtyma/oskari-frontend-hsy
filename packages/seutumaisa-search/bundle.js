/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.Bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.Bundle', function () {

}, {
    'create': function () {
        var me = this;
        var inst = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaSearch.BundleInstance');

        return inst;
    },
    'update': function (manager, bundle, bi, info) {

    }
}, {

    'protocol': ['Oskari.bundle.Bundle', 'Oskari.bundle.BundleInstance', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
    'source': {

        'scripts': [{
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-search/instance.js'
            }, {
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-search/Flyout.js'
            }, {
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-search/service/SeutumaisaSearchService.js'
            }, {
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-search/Tile.js'
            }, {
                'type': 'text/css',
                'src': '../../bundles/seutumaisa-search/resources/scss/style.scss'
            },
            {
                'type': 'text/javascript',
                'src': '../../libraries/noUiSlider-13.1.5/nouislider.js'
            },  {
                'type': 'text/javascript',
                'src': '../../libraries/js.cookie/js.cookie.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/jquery.longpress/jquery.longpress.js'
            }, {
                'type': 'text/css',
                'src': '../../libraries/noUiSlider-13.1.5/nouislider.css'
            }, {
                "type": "text/javascript",
                "src": "../../libraries/datepicker/resources/locale/datepicker-fi.js"
            }, {
                "type": "text/javascript",
                "src": "../../libraries/datepicker/resources/locale/datepicker-en-GB.js"
            }
        ],

        'locales': [{
            'lang': 'en',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-search/resources/locale/en.js'
        }, {
            'lang': 'fi',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-search/resources/locale/fi.js'
        }, {
            'lang': 'sv',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-search/resources/locale/sv.js'
        }]
    },
    'bundle': {
        'manifest': {
            'Bundle-Identifier': 'seutumaisa-search',
            'Bundle-Name': 'seutumaisa-search',
            'Bundle-Author': [{
                'Name': 'Marko Kuosmanne',
                'Organisation': 'Sitowise Oy',
                'Temporal': {
                    'Start': '2019',
                    'End': '2019'
                },
                'Copyleft': {
                    'License': {
                        'License-Name': 'EUPL',
                        'License-Online-Resource': 'http://www.paikkatietoikkuna.fi/license'
                    }
                }
            }],
            'Bundle-Name-Locale': {
                'fi': {
                    'Name': 'seutumaisa-search',
                    'Title': 'seutumaisa-search'
                },
                'en': {}
            },
            'Bundle-Version': '1.0.0',
            'Import-Namespace': ['Oskari', 'jquery'],
            'Import-Bundle': {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    'dependencies': ['jquery']

});

Oskari.bundle_manager.installBundleClass('seutumaisa-search', 'Oskari.mapframework.bundle.seutumaisaSearch.Bundle');
