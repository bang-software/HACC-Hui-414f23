import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ViewTeams from '../../components/administrator/ViewTeams';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const ViewTeamsPage = () => (
    <div id={PAGE_IDS.VIEW_TEAMS_PAGE}>
        <ViewTeams />
    </div>
);

export default withAllSubscriptions(ViewTeamsPage);
