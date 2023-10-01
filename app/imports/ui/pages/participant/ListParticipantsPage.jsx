import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/participant/ListParticipantsWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const ListParticipantsPage = () => (
    <div id={PAGE_IDS.LIST_PARTICIPANTS}>
      <ListDevelopersWidget />
    </div>
);

export default withAllSubscriptions(ListParticipantsPage);
