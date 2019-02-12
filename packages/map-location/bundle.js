/**
 * @class Oskari.hsy.bundle.mapLocation.Bundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.hsy.bundle.mapLocation.Bundle", function () {

}, {
    "create": function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.hsy.bundle.mapLocation.BundleInstance");
        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "protocol": ["Oskari.bundle.Bundle"],
    "source": {

        "scripts": [

        /*
         * map-location
         */
        {
            "type": "text/javascript",
            "src": "../../bundles/map-location/instance.js"
        }],

        "locales": []
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "map-location",
            "Bundle-Name": "map-location",
            "Bundle-Author": [{
                "Name": "MK",
                "Organisation": "Sitowise Oy",
                "Temporal": {
                    "Start": "2019",
                    "End": "2020"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale": {
                "fi": {
                    "Name": "link-panel",
                    "Title": "link-panel"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("map-location", "Oskari.hsy.bundle.mapLocation.Bundle");
