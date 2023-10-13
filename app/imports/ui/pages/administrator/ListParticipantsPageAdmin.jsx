import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidgetAdmin from '../../components/administrator/ListParticipantsWidgetAdmin';

const ListParticipantsPageAdmin = () => (
      <div>
        <ListDevelopersWidgetAdmin />;
      </div>
);

export default withAllSubscriptions(ListParticipantsPageAdmin);
