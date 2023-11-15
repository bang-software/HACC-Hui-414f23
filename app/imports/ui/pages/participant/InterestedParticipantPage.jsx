import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import InterestedParticipants from '../../components/participant/InterestedParticipants';

const InterestedParticipantPage = () => (
    <InterestedParticipants/>
);

export default withAllSubscriptions(InterestedParticipantPage);
