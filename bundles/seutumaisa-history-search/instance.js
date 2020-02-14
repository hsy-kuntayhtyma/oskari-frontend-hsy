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

        this.container = null;
        this.state = {};
        this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._templates = {
            searchRow: jQuery('<div class="row"><div class="title"></div><div class="field"></div><div class="clear"></div></div>'),
            slider: jQuery('<div><div class="slider-range"></div><div class="slider-range-values"><div style="float:left;"><input type="number" class="min"></div><div style="float:right;"><input type="number" class="max"></div><div style="clear:both;"></div></div>'),
            dateRange: jQuery('<div class="date-range"><input type="text" class="datepicker start"> - <input type="text" class="datepicker end"></div>')
        };
        this.searchFields = [];
        this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        this.conf = this.conf || {};
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'seutumaisa-history-search',

        /********************************** PUBLIC METHODS ***********************************/
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
            var me = this;
            if (me.started) {
                return;
            }

            me.started = true;

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            // create the SeutumaisaHistorySearchService for handling search.
            var seutumaisaHistorySearchService = Oskari.clazz.create('Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService', sandbox, this.getLocalization().service);
            me.sandbox.registerService(seutumaisaHistorySearchService);

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            this.mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            /* stateful */
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            var p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            // handle state
            var state = me.getState();
            me.setState(state);

            // Default tab priority
            if (me.conf && typeof me.conf.priority === 'number') {
                me.tabPriority = me.conf.priority;
            }

            me._createUI();
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

            return handler.apply(this, [event]);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {

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
         * Implements BundleInstance protocol stop method
         * @method stop
         */
        stop: function () {
            var sandbox = this.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
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
            this._clearHistorySearchTab(true,true);
        },
        /*************************************************************************************/

        /********************************** PRIVATE METHODS **********************************/

        /**
         * Creates UI
         * @private @method createUI
         * @public
         */
        _createUI: function () {
            var me = this;
            //me._setDatepickerLanguage();
            me.searchTab = me._getHistorySearchTab();
            me.resultsTab = me._getHistorySearchResultsTab();

            var title = me.getLocalization('searchtab')['title'],
                content = me.searchTab,
                priority = this.tabPriority,
                id = 'seutumaisa_historysearch',
                reqBuilder = Oskari.requestBuilder('SeutumaisaSearch.AddTabRequest'),
                req = reqBuilder(title, content, priority, id);

            me.sandbox.request(me, req);

            var title = me.getLocalization('resulttab')['title'],
                content = me.resultsTab,
                priority = this.tabPriority,
                id = 'seutumaisa_historysearch_results',
                reqBuilder = Oskari.requestBuilder('SeutumaisaSearch.AddTabRequest'),
                req = reqBuilder(title, content, priority, id);

            me.sandbox.request(me, req);
        },

        /**
         * Gets search values
         * @private @method _getSearchValues
         */
        _getSearchValues: function () {
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
         * Shows history search results.
         * @privat @method _showResults
         * @param {Object} err error
         * @param {Object} response response data
         * @param {Function} renderHandler render handler
         */
        _showResults: function (err, response, renderHandler) {
            var me = this;
            var tabLocale = me.getLocalization('resulttab');
            var numberColumns = [5];

            me.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'SEUTUMAISA-HISTORY-SEARCH']);

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

            me.sandbox.postRequestByName('SeutumaisaSearch.ChangeTabRequest', ['seutumaisa_historysearch_results']);

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

            // This hack fixes error when changes tab and showing results for it.
            // First page header cell widths are not sync in data cell widths.
            setTimeout(function(){
                table.draw();
            }, 100);

            if (typeof renderHandler === 'function') {
                renderHandler();
            }
        },

        /**
         * Clears history search tab
         * @private @method _clearHistorySearchTab
         * @param {Boolean} emptyResults  empty results
         * @param {Boolean} emptyCache  empty cache
         */
        _clearHistorySearchTab: function (emptyResults, emptyCache) {
            let me = this;
            let clearResults = emptyResults || false;
            let clearCache = emptyCache || false;
            me.searchFields.forEach(function(field) {
                var c = field.clazz;
                c.reset();
            });

            me.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', []);

            if (clearResults === true) {
                jQuery('div.seutumaisa-history-search-results').empty();
            }

            if(clearCache === true) {
                Cookies.remove('historySearchFields');
            }
        },

        /**
         * Gets history search tab container.
         * @private @method _getHistorySearchTab
         */
        _getHistorySearchTab: function () {
            var me = this;
            var service = me.sandbox.getService('Oskari.mapframework.bundle.seutumaisaHistorySearch.SeutumaisaHistorySearchService');
            if (me.searchFields.length > 0) {
                return;
            }

            var tabLocale = me.getLocalization('searchtab');

            var selectOptions = {
                placeholder_text: '',
                allow_single_deselect: true,
                disable_search_threshold: 10,
                width: '100%',
                allowReset: true
            };

            var tabContainer = jQuery('<div class="history-search-tab-container"><div class="fields"></div><div class="buttons"></div></div>');

            me.spinner.insertTo(tabContainer);

            var resetButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            resetButton.setTitle(tabLocale.clear);

            var resetHandler = function () {
                me.searchFields.forEach(function(field) {
                    var c = field.clazz;
                    c.reset();
                });
                me.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
            };
            jQuery(resetButton.getElement()).longpress(function() {
                me._clearHistorySearchTab(false, true);
            }, function() {
                me._clearHistorySearchTab(false, false);
            }, 5000);

            resetButton.insertTo(tabContainer.find('.buttons'));

            var searchButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            searchButton.addClass('primary');
            searchButton.setTitle(tabLocale.search);
            searchButton.setHandler(function() {
                var values = me._getSearchValues();
                me.spinner.start();

                service.search(values, function (err, response) {
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
            service.getHistorySearchFields(function (err, fields) {
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

            return tabContainer;
        },

        /**
         * Gets history search results tab container.
         * @private @method _getHistorySearchResultsTab
         */
        _getHistorySearchResultsTab: function () {
            var me = this;
            me.searchResultContainer = jQuery('<div class="seutumaisa-history-search-results"></div>');
            return me.searchResultContainer;
        }
        /*************************************************************************************/





    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });
