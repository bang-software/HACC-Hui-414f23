import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import YourTeamsWidget from '../../components/participant/YourTeamsWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const YourTeams = () => (
  <div id={PAGE_IDS.YOUR_TEAMS}>
    <YourTeamsWidget />
  </div>
);

export default withAllSubscriptions(YourTeams);
