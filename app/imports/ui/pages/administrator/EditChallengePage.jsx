import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditChallengeWidget from '../../components/administrator/EditChallengeWidget';

const EditChallengePage = () => (
    <EditChallengeWidget />
);

export default withAllSubscriptions(EditChallengePage);
