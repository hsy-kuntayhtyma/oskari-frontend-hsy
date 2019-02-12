/**
* @class Oskari.hsy.bundle.waterPipeTool.Bundle
*
*/
Oskari.clazz.define("Oskari.hsy.bundle.waterPipeTool.Bundle", function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.hsy.bundle.waterPipeTool.BundleInstance");
	},
	"start" : function() {
	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {
	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [
			{
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/instance.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/Flyout.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/TagPipe.js"
			},
			{
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/Tile.js"
			},
			{
				"type" : "text/css",
				"src" : "../../bundles/water-pipe-tool/resources/css/style.css"
			}],

        	"locales": [{
				"lang" : "fi",
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/resources/locale/fi.js"
			},{
				"lang" : "en",
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/resources/locale/en.js"
			},{
				"lang" : "sv",
				"type" : "text/javascript",
				"src" : "../../bundles/water-pipe-tool/resources/locale/sv.js"
			}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "water-pipe-tool",
			"Bundle-Name" : "water-pipe-tool",
			"Bundle-Author" : [{
				"Name" : "Dimenteq Oy",
				"Organisation" : "Dimenteq Oy",
				"Temporal" : {
					"Start" : "2016",
					"End" : "2016"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("water-pipe-tool", "Oskari.hsy.bundle.waterPipeTool.Bundle");