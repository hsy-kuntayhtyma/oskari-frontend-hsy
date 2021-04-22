import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { landmassToolHelper } from './LandMassToolHelper';

class ViewHandler extends StateHandler {
    constructor () {
        super();
        this.landmassToolHelper = landmassToolHelper();
        //this.fetchAdminAnnouncements();
        this.state = {
            announcements: [],
            active: true,
            activeKey: []
        };
    }

    fetchAdminAnnouncements () {
        this.landmassToolHelper.getLandMasstoolFields(function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.getAdminAnnouncementsFailed'));
            } else {
                console.log(data.data);
                this.updateState({
                    announcements: data.data
                });
            }
        }.bind(this));
    }
}

export const LandmassToolHandler = controllerMixin(ViewHandler, [
    'addForm', 'deleteAnnouncement', 'saveAnnouncement', 'updateAnnouncement', 'cancel', 'openCollapse'
]);