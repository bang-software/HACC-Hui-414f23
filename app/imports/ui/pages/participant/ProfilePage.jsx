import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ProfileWidget from '../../components/participant/Profile';

class ProfilePage extends React.Component {
  render() {
    return (
        <ProfileWidget />
    );
  }
}

export default withAllSubscriptions(ProfilePage);
