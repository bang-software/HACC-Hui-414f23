import React from 'react';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import Profile from '../../components/participant/Profile';

const ProfilePage = () => (
    <div id={PAGE_IDS.PROFILE_PAGE}>
      <Profile/>
    </div>
);

export default withAllSubscriptions(ProfilePage);
