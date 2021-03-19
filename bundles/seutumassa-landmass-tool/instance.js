
/**
 * @class Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance
 *
 * Main component and starting point for the admin-announcements functionality.
 *
 * See Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance for bundle definition.
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
        //  /**
        //   * @method getSandbox
        //   * @return {Oskari.Sandbox}
        //   */
        //  getSandbox: function () {
        //      return this.sandbox;
        //  },
        //  /**
        //   * @method getLocalization
        //   * Returns JSON presentation of bundles localization data for current language.
        //   * If key-parameter is not given, returns the whole localization data.
        //   *
        //   * @param {String} key (optional) if given, returns the value for key
        //   * @return {String/Object} returns single localization string or
        //   *      JSON object for complete data depending on localization
        //   *      structure and if parameter key is given
        //   */
        //  getLocalization: function (key) {
        //      if (!this._localization) {
        //          this._localization = Oskari.getLocalization(this.getName());
        //      }
        //      if (key) {
        //          return this._localization[key];
        //      }
        //      return this._localization;
        //  },

 }, {
     'extend': ['Oskari.userinterface.extension.DefaultExtension']
 }
);