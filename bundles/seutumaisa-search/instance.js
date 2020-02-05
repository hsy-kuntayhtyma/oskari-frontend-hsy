/**
* @class Oskari.mapframework.bundle.seutumaisaSearch.BundleInstance
*
* Oskari.mapframework.bundle.seutumaisaSearch.
*/
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.BundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this._localization = null;
        this.mapModule = null;
        this.seutumaisaSearchService = null;
        this.state = this.state || {};

    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'seutumaisa-search',
        /**
         * @method getName
         * @public
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * Sets the sandbox reference to this component
         * @method setSandbox
         * @public
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * Gets sandbox
         * @method getSandbox
         * @public
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         * @method getLocalization
         * @public
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * Implements BundleInstance protocol start methdod
         * @method start
         * @public
         */
        start: function () {
            if (this.started) {
                return;
            }

            var me = this,
                conf = me.conf,
                sandboxName = conf ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.started = true;
            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            // create the SeutumaisaSearchService for handling search.
            var seutumaisaSearchService = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaSearch.SeutumaisaSearchService', sandbox, this.getLocalization().service);
            me.sandbox.registerService(seutumaisaSearchService);
            me.seutumaisaSearchService = seutumaisaSearchService;

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            var request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(me);
            sandbox.request(me, request);

            this.mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            // update normal search tile text
            this.updateSearchTileText();

            /* stateful */
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            // handle state
            var state = me.getState();
            me.setState(state);

            this.requestHandlers = {
                addTabRequestHandler: Oskari.clazz.create(
                    'Oskari.mapframework.bundle.seutumaisaSearch.request.AddTabRequestHandler',
                    sandbox, this.plugins['Oskari.userinterface.Flyout'])
            };
            sandbox.requestHandler(
                'SeutumaisaSearch.AddTabRequest',
                this.requestHandlers.addTabRequestHandler);


        },

        /**
         * Update normal search tile text
         * @method updateSearchTileText
         * @param  {Integer}             count counter
         */
        updateSearchTileText: function (count) {
            var me = this;
            var tile = jQuery('div.oskari-tile.search div.oskari-tile-title');
            if(count > 10) {
                return;
            }
            if (tile.length === 0) {
                setTimeout(function(){
                    me.updateSearchTileText(count++);
                },200);
            } else {
                tile.html(this._localization.searchTitle)
            }
        },
        /**
         * Implements Module protocol init method - does nothing atm
         * @method init
         * @public
         */
        init: function () {
            return null;
        },
        /**
         * Implements BundleInstance protocol update method - does nothing atm
         * @method update
         * @public
         */
        update: function () {

        },
        /**
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @method onEvent
         * @public
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            this.plugins['Oskari.userinterface.Flyout'].onEvent(event);

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Fetch channel when flyout is opened
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    doOpen = event.getViewState() !== 'close',
                    p;
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (doOpen) {
                    this.plugins['Oskari.userinterface.Flyout'].createUI();

                    // flyouts eventHandlers are registered
                    for (p in this.plugins['Oskari.userinterface.Flyout'].getEventHandlers()) {
                        if (!this.eventHandlers[p]) {
                            this.sandbox.registerForEventByName(this, p);
                        }
                    }
                }
            }
        },

        /**
         * Implements BundleInstance protocol stop method
         * @method stop
         */
        stop: function () {
            var sandbox = this.sandbox,
                p,
                request;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * Implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerselection2.Flyout
         * Oskari.mapframework.bundle.layerselection2.Tile
         * @method startExtension
         * @public
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaSearch.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaSearch.Tile', this);
        },
        /**
         * Implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         * @method stopExtension
         * @public
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * Implements Oskari.userinterface.Extension protocol getPlugins method
         * @method getPlugins
         * @public
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * Gets title
         * @method getTitle
         * @public
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * Gets description
         * @method getDescription
         * @public
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
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
            this.state = state;
            this.plugins['Oskari.userinterface.Flyout'].clearSearchTab(true,true);
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
