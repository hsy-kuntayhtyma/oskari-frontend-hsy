


/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.<mynamespace>.<bundle-identifier>.MyBundle
 */
 Oskari.clazz.define("Oskari.hsy.bundle.seutumassa-landmass-tool.LandMassToolBundle", function() {
 
 }, {
    /**
     * @method create creates an Oskari DIV Manager instance
     * @return {Oskari.hsy.bundle.seutumassa-landmass-tool.LandMassToolBundleInstance}
     */
     "create" : function() {
         
         return Oskari.clazz.create("Oskari.hsy.bundle.seutumassa-landmass-tool.BundleInstance");
     },
    /**
     * @method update called by the bundle manager to inform on changes in bundlage
     */
     "update" : function(manager, bundle, bi, info) {

     }
 }, {
    /**
     * @static
     * @property protocol protocols implemented by this bundle
     */
    "protocol": ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance"],
     "source" : {
        /**
         * @static
         * @property source.scripts
         *
         */
        "scripts" : [{
            "type" : "text/javascript",
            "src": "../../bundles/seutumassa-landmass-tool/instance.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../bundles/seutumassa-landmass-tool/Flyout.js"
        },
        {
            'type': 'text/javascript',
            'src': '../../bundles/seutumassa-landmass-tool/service/SeutumassaLandmassToolService.js'
        }],
        'locales': [{
            'lang': 'en',
            'type': 'text/javascript',
            'src': '../../bundles/seutumassa-landmass-tool/resources/locale/en.js'
        }, {
            'lang': 'fi',
            'type': 'text/javascript',
            'src': '../../bundles/seutumassa-landmass-tool/resources/locale/fi.js'
        }, {
            'lang': 'sv',
            'type': 'text/javascript',
            'src': '../../bundles/seutumassa-landmass-tool/resources/locale/sv.js'
        }]
     },
     'bundle': {
        /**
         * @static
         * @property bundle.manifest
         */
         'manifest': {
             'Bundle-Identifier': 'seutumassa-landmass-tool',
             'Bundle-Name': 'seutumassa-landmass-tool',
             'Bundle-Author': [{
                 'Name': 'Tuomo Hautala',
                 'Organisation': 'Sitowise Oy',
                 'Temporal': {
                     'Start': '2021',
                     'End': '2021'
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
                     'Name': 'seutumassa-landmass-tool',
                     'Title': 'seutumassa-landmass-tool'
                 },
                 'en': {
                    'Name': 'seutumassa-landmass-tool',
                    'Title': 'seutumassa-landmass-tool'
                 },
                 'sv': {
                    'Name': 'seutumassa-landmass-tool',
                    'Title': 'seutumassa-landmass-tool'
                 }
             },
             'Bundle-Version': '1.0.0',
             'Import-Namespace': ['Oskari'],
             'Import-Bundle': {}
         }
     }
 });
 
 // Install this bundle by instantating the Bundle Class
 Oskari.bundle_manager.installBundleClass("seutumassa-landmass-tool", "Oskari.hsy.bundle.seutumassa-landmass-tool.LandMassToolBundle");