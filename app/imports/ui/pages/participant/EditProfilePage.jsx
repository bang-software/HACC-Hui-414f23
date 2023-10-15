import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditProfileWidget from '../../components/participant/EditProfileWidget';

const EditProfilePage = () => (
    <EditProfileWidget/>
);

export default withAllSubscriptions(EditProfilePage);
