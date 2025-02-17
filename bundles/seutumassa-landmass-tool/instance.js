
/**
 * @class Oskari.hsy.bundle.seutumassa-landmass-tool.BundleInstance
 *
 * Main component and starting point for the seutumassa-landmass-tool functionality.
 */
 Oskari.clazz.define('Oskari.hsy.bundle.seutumassa-landmass-tool.BundleInstance',

 /**
  * @method create called automatically on construction
  * @static
  */
 function () {
     var conf = this.getConfiguration();
     conf.name = 'seutumassa-landmass-tool';
     conf.flyoutClazz = 'Oskari.hsy.bundle.seutumassa-landmass-tool.Flyout';
     this.defaultConf = conf;
 }, {

    /**
     * @static
     * @property __name
     */
    __name: 'seutumassa-landmass-tool',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },

    afterStart: function (sandbox) {

    },

 }, {
     'extend': ['Oskari.userinterface.extension.DefaultExtension']
 }
);