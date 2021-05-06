import React from 'react';
import styled from 'styled-components';
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
            //console.log(flyout[0]);
            //console.log(el[0]);
            flyout[0].setAttribute('id', 'landmass-tool-container');
            this.container = el[0];
            this.container.setAttribute('id', 'landmass-tool-content');
        },
    
        /**
         * Interface method implementation, does nothing atm
         * @method startPlugin
         */
        
        startPlugin: function () {
            this.render();
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