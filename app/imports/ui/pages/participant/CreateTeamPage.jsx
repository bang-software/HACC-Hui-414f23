import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateTeamWidget from '../../components/participant/CreateTeamWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const CreateTeamPage = () => (
    <div id={PAGE_IDS.CREATE_TEAM}>
      <CreateTeamWidget />
    </div>
);
export default withAllSubscriptions(CreateTeamPage);
