jQuery(document).ready(function() {
    var getAppSetupParams = {};
    // populate url with possible control parameters
    Object.keys(window.controlParams || {}).forEach(function (key) {
        getAppSetupParams[key] = window.controlParams[key];
    });
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        data: getAppSetupParams,
        url: '/action?action_route=GetAppSetup',
        success: function (appSetup) {
            var app = Oskari.app;
            if (!appSetup.startupSequence) {
                jQuery('#mapdiv').append('Unable to start');
                return;
            }

            app.init(appSetup);
            // TODO: move to db
            // font is not recognized by theming and that is the point of it
            // for keeping the font that is defined for the page/overwritten.css
            Oskari.app.getTheming().setTheme({
                "font": "dont_change",
                "color": {
                    "icon": "#2C2A29",
                    "accent": "#007377",
                    "primary": "#00AAA3"
                },
                "map": {
                    "navigation": {
                        "roundness": 40,
                        "opacity": 0.8,
                        "color": {
                            "primary": "#ffffff",
                            "accent": "#00AAA3",
                            "text": "#000000"
                        }
                    }
                }
            });
            app.startApplication(function () {
                var sb = Oskari.getSandbox();
                
                // Add privacy statement link to logoplugin
                var logoService = sb.getService('Oskari.map.LogoPluginService');
                if (logoService !== null) {
                    var label = Oskari.getLocalization('Logoplugin')['privacy-statement'];
                    var URL = Oskari.getLocalization('Logoplugin')['privacy-statement-url'];
                    var options = {
                        id: label,
                        callback: function() {
                            window.open(URL, '_blank');
                        }
                    };
                    logoService.addLabel(label, options);
                }
            });
        },
        error: function (jqXHR, textStatus) {
            if (jqXHR.status !== 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});