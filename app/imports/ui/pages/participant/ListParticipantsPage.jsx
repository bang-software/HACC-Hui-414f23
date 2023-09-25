import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/participant/ListParticipantsWidget';

const ListParticipantsPage = () => (
    <ListDevelopersWidget />
);

export default withAllSubscriptions(ListParticipantsPage);
