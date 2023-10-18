import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import YourTeamsWidget from '../../components/participant/YourTeamsWidget';

const YourTeams = () => (
    <YourTeamsWidget />
);

export default withAllSubscriptions(YourTeams);
