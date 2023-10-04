import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import TeamInvitationsWidget from '../../components/participant/TeamInvitationsWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const TeamInvitationsPage = () => (
    <div id={PAGE_IDS.TEAM_INVITATIONS_PAGE}>
        <TeamInvitationsWidget/>
    </div>
);

export default withAllSubscriptions(TeamInvitationsPage);
