import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AllTeamInvitationsWidget from '../../components/administrator/AllTeamInvitationsWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const AllTeamInvitationsPage = () => (
  <div id={PAGE_IDS.ALL_TEAM_INVITATIONS}>
        <AllTeamInvitationsWidget />
    </div>
);

export default withAllSubscriptions(AllTeamInvitationsPage);
