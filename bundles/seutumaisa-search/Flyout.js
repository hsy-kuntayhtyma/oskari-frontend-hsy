/**
 * @class Oskari.mapframework.bundle.seutumaisaSearch.Flyout
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.seutumaisaSearch.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.mapframework.bundle.seutumaisaSearch}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.sb = instance.getSandbox();
        this.container = null;
        this.state = {};
        this.tabsContainer = null;
        this._localization = this.instance.getLocalization('flyout');
        this.service = this.sb.getService('Oskari.mapframework.bundle.seutumaisaSearch.SeutumaisaSearchService');
        this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.log = Oskari.log('Oskari.mapframework.bundle.seutumaisaSearch.Flyout');
        this._templates = {
            searchRow: jQuery('<div class="row"><div class="title"></div><div class="field"></div><div class="clear"></div></div>'),
            slider: jQuery('<div><div class="slider-range"></div><div class="slider-range-values"><div style="float:left;"><input type="number" class="min"></div><div style="float:right;"><input type="number" class="max"></div><div style="clear:both;"></div></div>'),
            dateRange: jQuery('<div class="date-range"><input type="text" class="datepicker start"> - <input type="text" class="datepicker end"></div>')
        };
        this.searchFields = [];
        this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    }, {
        /**
         * @method getName
         * @public
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.seutumaisaSearch.Flyout';
        },

        /**
         * Interface method implementation
         * @public @method setEl
         * @param {Object} el reference to the container in browser         *
         */
        setEl: function (el) {
            this.container = jQuery(el[0]);
            this.container.addClass('seutumaisa-search');
        },
        /**
        * Interface method implementation, assigns the HTML templates
        * that will be used to create the UI
        * @public @method startPlugin
        */
        startPlugin: function () {
            this.createUI();
        },
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
            me.searchTab = me._getSearchTab();
            me.resultsTab = me._getSearchResultsTab();
            tabsContainer.addPanel(me.searchTab);
            tabsContainer.addPanel(me.resultsTab);
            tabsContainer.insertTo(me.container);
            me.spinner.insertTo(jQuery('.tab-content.search-tab'));
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

        _highlightSelectedRows: function () {
            var me = this;
            var table = me.searchResultContainer.find('table.datatable').DataTable();

            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'SEUTUMAISA-SEARCH']);

            var features = [];
            for (var i = 0; i < table.rows('.selected').data().length; i++) {
                var selectedData = table.rows('.selected').data()[i];
                var geoJSON = selectedData[selectedData.length-1];
                features.push({
                    type: 'Feature',
                    geometry: JSON.parse(geoJSON)
                });
            }
            var geojsonObject = {
              'type': 'FeatureCollection',
              'crs': {
                'type': 'name',
                'properties': {
                  'name': 'EPSG:3879'
                }
              },
              'features': features
            };

            var featureStyle = {
              stroke: {
                color: 'rgba(0,135,135,0.7)',
                width: 2
              },
              fill: {
                color: 'rgba(0,170,163,0.7)'
              }
            };

            var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
            me.sb.postRequestByName(rn, [geojsonObject, {
                layerId: 'SEUTUMAISA-SEARCH',
                clearPrevious: true,
                layerOptions: null,
                centerTo: true,
                featureStyle: featureStyle,
                attributes: null
            }]);
        },

        _showResults: function (err, response, renderHandler) {
            var me = this;
            var tabLocale = me._getLocalization('resulttab');
            var numberColumns = me.instance.conf.numberColumns || [7];

            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'SEUTUMAISA-SEARCH']);

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

            table.on('select', function ( e, dt, type, indexes ) {
                if ( type === 'row' ) {
                    me._highlightSelectedRows();
                }
            });

            table.on('deselect', function ( e, dt, type, indexes ) {
                if ( type === 'row' ) {
                    me._highlightSelectedRows();
                }
            });

            if (typeof renderHandler === 'function') {
                renderHandler();
            }
        },

        clearSearchTab: function (emptyResults, emptyCache) {
            var me = this;
            var clearResults = emptyResults || false;
            var clearCache = emptyCache || false;
            me.searchFields.forEach(function(field) {
                var c = field.clazz;
                c.reset();
            });
            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', []);

            if(clearResults === true) {
                jQuery('div.seutumaisa-search-results').empty();
                this.tabsContainer.select(me.searchTab);
            }

            if(clearCache === true) {
                Cookies.remove('searchFields');
            }
        },

        _getSearchTab: function () {
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

            var tabContainer = jQuery('<div class="search-tab-container"><div class="fields"></div><div class="buttons"></div></div>');

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
                me.clearSearchTab(false, true);
            }, function() {
                me.clearSearchTab(false, false);
            }, 5000);

            resetButton.insertTo(tabContainer.find('.buttons'));

            var searchButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            searchButton.addClass('primary');
            searchButton.setTitle(tabLocale.search);
            searchButton.setHandler(function() {
                var values = me._getSearchValues();
                me.spinner.insertTo(jQuery('.tab-content.search-tab'));
                me.spinner.start();

                me.service.search(values, function (err, response) {
                    me.spinner.stop();
                    var renderHandler = null;

                    if (values.planned_date && response.data.length > 0) {
                        renderHandler = function () {
                            jQuery('.seutumaisa-search-results').find('table.datatable').DataTable().rows().select();
                        };
                    }

                    me._showResults(err, response, renderHandler);
                });

            });
            searchButton.insertTo(tabContainer.find('.buttons'));

            me.spinner.start();

            this.service.getSearchFields(function (err, fields) {
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
            tab.setId('search-tab');
            return tab;
        },

        /**
         *
         *
         */
        addTab: function (item) {
            var me = this,
                flyout = jQuery(me.container);
            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);

                if (me.instance.disableDefault !== true) {
                    var defaultPanel = Oskari.clazz.create(
                            'Oskari.userinterface.component.TabPanel'
                        ),
                        searchContainer = jQuery('div.seutumaisaSearchContainer');

                    defaultPanel.setTitle(
                        me.getTabTitle(),
                        'oskari_seutumaisasearch_tabpanel_header'
                    );
                    defaultPanel.setContent(searchContainer);
                    defaultPanel.setId('oskari_seutumaisasearch_tabpanel_header');
                    defaultPanel.setPriority(me.instance.tabPriority);
                    me.tabsContainer.addPanel(defaultPanel);
                }
            }

            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(item.title, item.id);
            panel.setId(item.id);
            panel.setContent(item.content);
            panel.setPriority(item.priority);
            me.tabsContainer.addPanel(panel);
        },

        _getSearchResultsTab: function () {
            var me = this;
            me.searchResultContainer = jQuery('<div class="seutumaisa-search-results"></div>');
            var tab = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            tab.setTitle('Hakutulokset');

            tab.setContent(me.searchResultContainer);
            tab.setId('search-results-tab');
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
         * Gets localization
         * @method _getLocalization
         * @private
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },

        /**
         * Gets title
         * @method getTitle
         * @public
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this._getLocalization('title');
        },

        /**
         * Gets description
         * @method getDescription
         * @public
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this._getLocalization('desc');
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
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
