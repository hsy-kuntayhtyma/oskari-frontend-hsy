import React from 'react';
import ReactDOM from 'react-dom';
import { LandMassTool, } from './view/';
import { LocaleProvider } from 'oskari-ui/util';

/**
 * @class Oskari.hsy.bundle.seutumassa-landmass-tool.Flyout
 *
 * Renders the admin-announcements flyout.
 */
Oskari.clazz.define('Oskari.hsy.bundle.seutumassa-landmass-tool.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.hsy.bundle.seutumassa-landmass-tool.Flyout} instance
     *    reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        //this.sb = instance.getSandbox();
        this.container = null;
        //this._localization = this.instance.getLocalization('flyout');
        //this.service = this.sb.getService('Oskari.hsy.bundle.seutumassa-landmass-tool.SeutumassaLandmassToolService');
        //this.announcementsListHandler = new AnnouncementsListHandler();
        //this.announcementsListHandler.addStateListener(() => this.render());
        this.seutumassaFields = null;
    }, {
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
        },

        

        /**
         * Interface method implementation, does nothing atm
         * @method startPlugin
         */
        
        startPlugin: function () {
            this.render();

            // var me = this,
            // conf = me.conf,
            // sandboxName = conf ? conf.sandbox : 'sandbox',
            // sandbox = Oskari.getSandbox(sandboxName);

            // me.started = true;
            // me.sandbox = sandbox;

            // this._localization = Oskari.getLocalization(this.getName());

            // // create the SeutumaisaSearchService for handling search.
            // var seutumassaLandmassToolService = Oskari.clazz.create('Oskari.hsy.bundle.seutumassa-landmass-tool.SeutumassaLandmassToolService', sandbox, this.getLocalization().service);
            // me.sandbox.registerService(seutumassaLandmassToolService);
            // me.seutumassaLandmassToolService = seutumassaLandmassToolService;

            // seutumassaLandmassToolService.getSearchFields(function (err, fields) {
            //     if (err) {
            //         me.log.warn('Cannot get fields');
            //         return;
            //     }
            //     console.log(fields);
            //     this.seutumassaFields = fields;
            // });
        },

        /**
         * @method render
         * Renders React content
         */
        render: function () {
            if (!this.container) {
                return;
            }
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <LandMassTool
                        // {...this.announcementsListHandler.getState()}
                        // controller={this.announcementsListHandler.getController()}
                    />
                </LocaleProvider>
            );
            ReactDOM.render(content, this.container);
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });