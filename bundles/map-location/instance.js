/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance
 *
 * Registers and starts the
 * Oskari.hsy.bundle.mapLocation.BundleInstance.
 */
Oskari.clazz.define("Oskari.hsy.bundle.mapLocation.BundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.state = this.state || {};

    }, {
        __name: 'map-location',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
            var me = this;
        },

        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.setSandbox(sandbox);

            if(me.conf && me.conf.zoom && me.conf.x && me.conf.y) {
                sandbox.postRequestByName('MapMoveRequest', [me.conf.x, me.conf.y, me.conf.zoom]);
            }

            /* stateful */
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            // handle state
            var state = me.getState();
            me.setState(state);
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
            this.started = false;
            this.sandbox.unregisterStateful(this.mediator.bundleId);
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            return this.state;
        },
        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            var me = this;
            this.state = state;
            if(me.conf && me.conf.zoom && me.conf.x && me.conf.y) {
                me.sandbox.postRequestByName('MapMoveRequest', [me.conf.x, me.conf.y, me.conf.zoom]);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });