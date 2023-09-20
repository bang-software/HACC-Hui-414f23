import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateProfileWidget from '../../components/participant/CreateProfileWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

class CreateProfilePage extends React.Component {
  render() {
    return (
      <div id={PAGE_IDS.CREATE_PROFILE}>
        <CreateProfileWidget/>
      </div>
    );
  }
}

export default withAllSubscriptions(CreateProfilePage);
