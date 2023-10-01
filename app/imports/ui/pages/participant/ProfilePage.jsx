import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import Profile from '../../components/participant/Profile';

const ProfilePage = () => (
    <div id={'profile-page'}>
      <Profile/>
    </div>
);

export default withAllSubscriptions(ProfilePage);
