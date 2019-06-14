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
                allow_single_deselect: false,
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
            };
            jQuery(resetButton.getElement()).longpress(function(e) {
                Cookies.remove('searchFields');
                resetHandler();
            }, function(e) {
                resetHandler();
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
                    console.log(values);
                    me.spinner.stop();

                    me.tabsContainer.select(me.resultsTab);
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
                                    slider[0].noUiSlider.set([field.min, field.max]);
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

                        range.find('.datepicker').datepicker({'dateFormat': 'yy-mm-dd', 'changeMonth': true, 'changeYear': true, 'showButtonPanel': true}).attr('readonly', 'readonly');
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

        _getSelectField: function (){

        },

        _getSearchResultsTab: function () {
            var tab = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            tab.setTitle('Hakutulokset');
            tab.setContent('<p>some Html</p>');
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
