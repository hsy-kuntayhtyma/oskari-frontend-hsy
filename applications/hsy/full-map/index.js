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