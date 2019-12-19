/*
 * @class Oskari.mapframework.bundle.seutumaisaHistorySearch.Tile
 *
 * Renders the "Seutumaisa history search" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaHistorySearch.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.mapframework.bundle.seutumaisaHistorySearch}
 * instance
 *      reference to component that created the tile
 */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.shownLayerCount = null;
    }, {
        /**
         * Gets name
         * @method getName
         * @public
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.seutumaisaHistorySearch.Tile';
        },
        /**
         * Interface method implementation
         * @method setEl
         * @public
         * @param {Object} el reference to the container in browser
         */
        setEl: function (el) {
            this.container = jQuery(el);
        },
        /**
         * Interface method implementation, calls #refresh()
         * @method startPlugin
         * @public
         */
        startPlugin: function () {
            this.createUI();
        },
        /**
         * Interface method implementation, clears the container
         * @method stopPlugin
         * @public
         */
        stopPlugin: function () {
            this.container.empty();
        },
        /**
         * Creates the UI for a fresh start
         * @method _createUI
         * @public
         */
        createUI: function () {
            this.container.addClass('seutumaisa-history-search-tile');
        },
        /**
        * Gets tile
        * @method getTitle
        * @public
        * @return {String} localized text for the title of the tile
        */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * Gets description
         * @method getDescription
         * @public
         * @return {String} localized text for the description of the tile
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * Interface method implementation, does nothing atm
         * @method getOptions
         * @public
         */
        getOptions: function () {
        },
        /**
         * Interface method implementation, does nothing atm
         * @method setState
         * @public
         * @param {Object} state state that this component should use
         */
        setState: function (state) {
        },
        /**
         * Creates the UI for a fresh start
         * @method refresh
         * @public
         */
        refresh: function () {
            var me = this;
        },
        /**
         * Clears tile
         * @method clear
         */
        clear: function () {
            var me = this;
            me.refresh();
        }

    }, {
    /**
     * @property {String[]} protocol
     * @static
     */
        'protocol': ['Oskari.userinterface.Tile']
    });
