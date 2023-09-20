import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateTeamWidget from '../../components/participant/CreateTeamWidget';

const CreateTeamPage = () => (
      <CreateTeamWidget/>
  );

export default withAllSubscriptions(CreateTeamPage);
