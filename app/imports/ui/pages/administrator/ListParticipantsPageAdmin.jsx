import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidgetAdmin from '../../components/administrator/ListParticipantsWidgetAdmin';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const ListParticipantsPageAdmin = () => (
      <div id={PAGE_IDS.LIST_PARTICIPANTS_ADMIN}>
        <ListDevelopersWidgetAdmin />;
      </div>
);

export default withAllSubscriptions(ListParticipantsPageAdmin);
