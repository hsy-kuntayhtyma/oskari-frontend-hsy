/**
* @class Oskari.mapframework.bundle.seutumaisaHistorySearch.BundleInstance
*
* Oskari.mapframework.bundle.seutumaisaHistorySearch.
*/
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaHistorySearch.BundleInstance',

/**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.mapframework.bundle.seutumaisaSearch}
     * instance
     * Reference to component that created the tile
     *
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this.mapModule = null;
        this.seutumaisaSearchService = null;

        this.container = null;
        this.state = {};
        this.tabsContainer = null;
        this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._templates = {
            searchRow: jQuery('<div class="row"><div class="title"></div><div class="field"></div><div class="clear"></div></div>'),
            slider: jQuery('<div><div class="slider-range"></div><div class="slider-range-values"><div style="float:left;"><input type="number" class="min"></div><div style="float:right;"><input type="number" class="max"></div><div style="clear:both;"></div></div>'),
            dateRange: jQuery('<div class="date-range"><input type="text" class="datepicker start"> - <input type="text" class="datepicker end"></div>')
        };
        this.searchFields = [];
        this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    }, {
        /**
         * Creates UI
         * @method createUI
         * @public
         */
        createUI: function () {
            if (this.tabsContainer) {
                return;
            }

            var me = this;
            me._setDatepickerLanguage();
            var tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            tabsContainer.addTabChangeListener(me.tabChanged);
            me.tabsContainer = tabsContainer;
            me.searchTab = me._getHistorySearchTab();
            me.resultsTab = me._getHistorySearchResultsTab();
            tabsContainer.addPanel(me.searchTab);
            tabsContainer.addPanel(me.resultsTab);
            tabsContainer.insertTo(jQuery('.seutumaisa-search'));
            me.spinner.insertTo(jQuery('.tab-content.history-search-tab'));
        },

        /**
         * Handles tab changes
         * @method tabChanged
         * @public
         * @param  {Object}   previous previous tab
         * @param  {Object}   current  current tab
         */
        tabChanged: function (previous, current) {
        },

        _getSearchValues: function (){
            var me = this;
            var values = {};
            me.searchFields.forEach(function(field) {
                var c = field.clazz;
                if(c.isEnabled() && c.getValue() !== '' && c.getValue() !== null) {
                    var value = c.getValue();
                    if(!isNaN(value)) {
                        value = parseFloat(value);
                    }
                    values[field.id] = value;
                }
            });
            return values;
        },

        /**
         * Sets datepicker language
         * @method  _setDatepickerLanguage
         * @private
         */
        _setDatepickerLanguage: function () {
            var storedLanguage = Cookies.get('oskari.language');

            var lang = null;
            if (storedLanguage == null) {
                var supportedLanguages = Oskari.getSupportedLanguages();
                lang = 'en-GB';
                for (var i = 0; i < supportedLanguages.length; i++) {
                    if (supportedLanguages[i].indexOf('en') > -1) {
                        break;
                    }

                    if (supportedLanguages[i].indexOf('fi') > -1) {
                        lang = 'fi';
                        break;
                    }
                }
            } else {
                lang = storedLanguage;
            }

            jQuery.datepicker.setDefaults(
                jQuery.extend(
                    jQuery.datepicker.regional[lang],
                    {'dateFormat': 'yy-mm-dd'}
                )
            );
        },

        _showResults: function (err, response, renderHandler) {
            var me = this;
            var tabLocale = me._getLocalization('resulttab');
            var numberColumns = me.instance.conf.numberColumns || [5];

            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'SEUTUMAISA-HISTORY-SEARCH']);

            if (err) {
                me.dialog.show(tabLocale.error.title, tabLocale.error.message);
                me.dialog.fadeout();
                return;
            }

            if(response.data.length === 0) {
                me.dialog.show(tabLocale.noresults.title, tabLocale.noresults.message);
                me.dialog.fadeout();
                return;
            }

            me.tabsContainer.select(me.resultsTab);

            me.searchResultContainer.empty();
            me.searchResultContainer.append('<div class="datatable-container"><div class="export-buttons"></div><table class="datatable"></table></div>');
            var columns = response.columns;
            numberColumns.forEach(function(columnIndex) {
                columns[columnIndex].render = jQuery.fn.dataTable.render.number(' ', '.', 0, '', '');
                columns[columnIndex].className =  'text-right';
            });

            me.searchResultContainer.find('table.datatable').DataTable( {
                data: response.data,
                columns: columns,
                columnDefs: response.columnDefs,
                scrollY: 300,
                language: tabLocale.datatable,
                buttons: [
                    'copy', 'csv'
                ],
                dom: 'Bfrtip',
                select: true
            } );

            var table = me.searchResultContainer.find('table.datatable').DataTable();
            if (typeof renderHandler === 'function') {
                renderHandler();
            }
        },

        clearHistorySearchTab: function (emptyResults, emptyCache) {
            var me = this;
            var clearResults = emptyResults || false;
            var clearCache = emptyCache || false;
            me.searchFields.forEach(function(field) {
                var c = field.clazz;
                c.reset();
            });
            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', []);

            if(clearResults === true) {
                jQuery('div.seutumaisa-history-search-results').empty();
                this.tabsContainer.select(me.searchTab);
            }

            if(clearCache === true) {
                Cookies.remove('searchFields');
            }
        },

        _getHistorySearchTab: function () {
            var me = this;
            if (me.searchFields.length > 0) {
                return;
            }

            var tabLocale = me._getLocalization('searchtab');

            var tab = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            tab.setTitle(tabLocale.title);

            var selectOptions = {
                placeholder_text: '',
                allow_single_deselect: true,
                disable_search_threshold: 10,
                width: '100%',
                allowReset: true
            };

            var tabContainer = jQuery('<div class="history-search-tab-container"><div class="fields"></div><div class="buttons"></div></div>');

            var resetButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            resetButton.setTitle(tabLocale.clear);

            var resetHandler = function () {
                me.searchFields.forEach(function(field) {
                    var c = field.clazz;
                    c.reset();
                });
                me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
            };
            jQuery(resetButton.getElement()).longpress(function() {
                me.clearHistorySearchTab(false, true);
            }, function() {
                me.clearHistorySearchTab(false, false);
            }, 5000);

            resetButton.insertTo(tabContainer.find('.buttons'));

            var searchButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            searchButton.addClass('primary');
            searchButton.setTitle(tabLocale.search);
            searchButton.setHandler(function() {
                var values = me._getSearchValues();
                me.spinner.insertTo(jQuery('.tab-content.history-search-tab'));
                me.spinner.start();

                me.service.search(values, function (err, response) {
                    me.spinner.stop();
                    var renderHandler = null;

                    if (values.planned_date && response.data.length > 0) {
                        renderHandler = function () {
                            jQuery('.seutumaisa-history-search-results').find('table.datatable').DataTable().rows().select();
                        };
                    }

                    me._showResults(err, response, renderHandler);
                });

            });
            searchButton.insertTo(tabContainer.find('.buttons'));

            me.spinner.start();
            this.service.getHistorySearchFields(function (err, fields) {
                if (err) {
                    me.log.warn('Cannot get fields');
                    return;
                }

                fields.forEach(function(field) {
                    // create select input
                    if (field.type === 'select') {

                        // not allow empty select show
                        if(field.values.length === 0) {
                            return;
                        }
                        var row = me._templates.searchRow.clone();

                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', field.id);
                        selectOptions.cls = field.cls || null;
                        selectOptions.placeholder_text = field.placeHolderText || null;
                        selectOptions.allowReset = true;

                        if(field.title) {
                            var title = row.find('.title');
                            title.html(field.title);
                        }

                        var dropdown = select.create(field.values, selectOptions);

                        dropdown.css({
                            width: '96%',
                            paddingBottom: '1em'
                        });

                        row.find('.field').append(dropdown);

                        me.searchFields.push({
                            id: field.id,
                            clazz: select
                        });

                        if(field.values.length === 0) {
                            select.setEnabled(false);
                            var title = row.find('.title');
                            title.addClass('disabled');
                            title.html(title.html() + ' ' + tabLocale.noValues);
                        }

                        tabContainer.find('.fields').append(row);
                        select.adjustChosen();
                    }
                    // create range slider
                    else if (field.type === 'range') {
                        var row = me._templates.searchRow.clone();

                        if(field.title) {
                            var title = row.find('.title');
                            title.html(field.title);
                        }

                        var slider = me._templates.slider.clone();
                        var sliderEl = slider.find('.slider-range');

                        row.find('.field').append(slider);

                        noUiSlider.create(sliderEl[0], {
                            start: [field.min, field.max],
                            connect: true,
                            range: {
                                'min': field.min,
                                'max': field.max
                            },
                            margin: 10,
                            step: 5,
                            tooltips: true,
                            format: {
                                to: function (value) {
                                    return parseInt(value);
                                },
                                from: function (value) {
                                    return parseInt(value);
                                }
                            }
                        });

                        slider.find('input.min').on('change', function () {
                            sliderEl[0].noUiSlider.set([jQuery(this).val(), null]);
                        });
                        slider.find('input.max').on('change', function () {
                            sliderEl[0].noUiSlider.set([null, jQuery(this).val()]);
                        });

                        sliderEl[0].noUiSlider.on('update', function (values, handle) {
                            var value = values[handle];

                            if (handle) {
                                slider.find('input.max').val(value);
                            } else {
                                slider.find('input.min').val(value);
                            }
                        });

                        me.searchFields.push({
                            id: field.id,
                            clazz: {
                                getValue: function () {
                                    var ret = {};
                                    var values = sliderEl[0].noUiSlider.get();
                                    ret.start = values[0];
                                    ret.end = values[1];
                                    return ret;
                                },
                                isEnabled: function() {
                                    return true;
                                },
                                reset: function () {
                                    sliderEl[0].noUiSlider.set([field.min, field.max]);
                                }
                            }
                        });

                        tabContainer.find('.fields').append(row);
                    }
                    // create date range slider
                    else if (field.type === 'daterange') {
                        var row = me._templates.searchRow.clone();

                        if(field.title) {
                            var title = row.find('.title');
                            title.html(field.title);
                        }

                        var range =  me._templates.dateRange.clone();

                        // modify datepicker current day functionality to also select current date
                        jQuery.datepicker._gotoToday = function(id) {
                          var inst = this._getInst(jQuery(id)[0]);
                          var date = new Date();
                          this._selectDay(id, date.getMonth(), date.getFullYear(), inst.dpDiv.find('td.ui-datepicker-today'));
                        }

                        range.find('.datepicker').datepicker({
                            dateFormat: 'yy-mm-dd',
                            changeMonth: true,
                            changeYear: true,
                            showButtonPanel: true
                        }).attr('readonly', 'readonly');

                        range.find('.datepicker').datepicker('option', 'gotoCurrent', true);



                        row.find('.field').append(range);
                        tabContainer.find('.fields').append(row);

                         me.searchFields.push({
                            id: field.id,
                            clazz: {
                                getValue: function () {
                                    var ret = {};
                                    var datepickerStart = range.find('.datepicker.start');
                                    ret.start = datepickerStart.val();
                                    var datepickerEnd = range.find('.datepicker.end');
                                    ret.end = datepickerEnd.val();
                                    if(ret.start === "" && ret.end === "") {
                                        ret = null;
                                    } else {
                                        if(ret.start === "") {
                                            delete ret.start;
                                        }
                                        if(ret.end === "") {
                                            delete ret.end;
                                        }
                                    }
                                    return ret;
                                },
                                isEnabled: function() {
                                    return true;
                                },
                                reset: function () {
                                    range.find('.datepicker.start').val('');
                                    range.find('.datepicker.end').val('');
                                }
                            }
                        });
                    }
                });

                me.spinner.stop();
            });

            tab.setContent(tabContainer);
            tab.setId('history-search-tab');
            return tab;
        },

        _getHistorySearchResultsTab: function () {
            var me = this;
            me.searchResultContainer = jQuery('<div class="seutumaisa-history-search-results"></div>');
            var tab = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            tab.setTitle('Historian hakutulokset');

            tab.setContent(me.searchResultContainer);
            tab.setId('history-search-results-tab');
            return tab;
        },

        /**
         * Gets event handlers
         * @method getEventHandlers
         * @public
         */
        getEventHandlers: function () {

        },

        /**
         * On event
         * @method onEvent
         * @param  {Object} event
         */
        onEvent: function (event) {

        },

        /**
         * Interface method implementation, does nothing atm
         * @method stopPlugin
         * @public
         */
        stopPlugin: function () {

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
            this.state = state;
        },
        /**
         * @method refresh
         * @public
         */
        refresh: function () {

        }
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'seutumaisa-history-search',
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

            this.service = this.sandbox.getService('Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService');

            me.started = true;
            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            // create the SeutumaisaHistorySearchService for handling search.
            var seutumaisaHistorySearchService = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService', sandbox, this.getLocalization().service);
            me.sandbox.registerService(seutumaisaHistorySearchService);
            me.seutumaisaHistorySearchService = seutumaisaHistorySearchService;

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
            //this.updateSearchTileText();

            /* stateful */
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            // handle state
            var state = me.getState();
            me.setState(state);

            me.createUI();


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
            this.onEvent(event);

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
                    this.createUI();

                    // flyouts eventHandlers are registered
                    for (p in this.getEventHandlers()) {
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
            this.clearHistorySearchTab(true,true);
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
