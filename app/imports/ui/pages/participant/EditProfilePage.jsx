import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditProfileWidget from '../../components/participant/EditProfileWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const EditProfilePage = () => (
    <div id={PAGE_IDS.EDIT_PROFILE}>
      <EditProfileWidget/>
    </div>
);

export default withAllSubscriptions(EditProfilePage);
