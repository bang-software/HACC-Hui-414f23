import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditChallengeWidget from '../../components/administrator/EditChallengeWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const EditChallengePage = () => (
    <div id={PAGE_IDS.EDIT_CHALLENGE_PAGE}>
      <EditChallengeWidget />
    </div>
);

export default withAllSubscriptions(EditChallengePage);
