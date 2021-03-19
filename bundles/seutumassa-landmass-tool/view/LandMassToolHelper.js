export const landmassToolHelper = () => {
    const getLandmassToolFields = (handler) => {
        if (typeof handler !== 'function') {
            return;
        }

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            data: { all: true },
            url: Oskari.urls.getRoute('Announcements'),
            success: function (pResp) {
                handler(null, pResp);
            },
            error: function (jqXHR, textStatus) {
                handler('Error', []);
            }
        });
    };

    return {
        getLandmassToolFields,
    };
};