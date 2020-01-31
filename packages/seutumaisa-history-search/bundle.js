/**
 * @class Oskari.mapframework.bundle.seutumaisaHistorySearch.Bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaHistorySearch.Bundle', function () {

}, {
    'create': function () {
        var me = this;
        var inst = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaHistorySearch.BundleInstance');

        return inst;
    },
    'update': function (manager, bundle, bi, info) {

    }
}, {

    'protocol': ['Oskari.bundle.Bundle', 'Oskari.bundle.BundleInstance', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
    'source': {

        'scripts': [{
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-history-search/instance.js'
            }, {
                'type': 'text/javascript',
                'src': '../../bundles/seutumaisa-history-search/service/SeutumaisaHistorySearchService.js'
            }, {
                'type': 'text/css',
                'src': '../../bundles/seutumaisa-history-search/resources/scss/style.scss'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/noUiSlider-13.1.5/nouislider.js'
            }, {
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
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/JSZip-2.5.0/jszip.min.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/pdfmake-0.1.36/pdfmake.min.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/pdfmake-0.1.36/vfs_fonts.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/DataTables-1.10.18/js/jquery.dataTables.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/Buttons-1.5.6/js/dataTables.buttons.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/Buttons-1.5.6/js/buttons.flash.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/Buttons-1.5.6/js/buttons.html5.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/Buttons-1.5.6/js/buttons.print.js'
            }, {
                'type': 'text/javascript',
                'src': '../../libraries/DataTables/Select-1.3.0/js/dataTables.select.js'
            }, {
                'type': 'text/css',
                'src': '../../libraries/DataTables/DataTables-1.10.18/css/jquery.dataTables.min.css'
            }, {
                'type': 'text/css',
                'src': '../../libraries/DataTables/Buttons-1.5.6/css/buttons.dataTables.min.css'
            }, {
                'type': 'text/css',
                'src': '../../libraries/DataTables/Select-1.3.0/css/select.dataTables.min.css'
            }
        ],

        'locales': [{
            'lang': 'en',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-history-search/resources/locale/en.js'
        }, {
            'lang': 'fi',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-history-search/resources/locale/fi.js'
        }, {
            'lang': 'sv',
            'type': 'text/javascript',
            'src': '../../bundles/seutumaisa-history-search/resources/locale/sv.js'
        }]
    },
    'bundle': {
        'manifest': {
            'Bundle-Identifier': 'seutumaisa-history-search',
            'Bundle-Name': 'seutumaisa-history-search',
            'Bundle-Author': [{
                'Name': 'Oskari Rintamäki',
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
                    'Name': 'seutumaisa-history-search',
                    'Title': 'seutumaisa-history-search'
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

Oskari.bundle_manager.installBundleClass('seutumaisa-history-search', 'Oskari.mapframework.bundle.seutumaisaHistorySearch.Bundle');
