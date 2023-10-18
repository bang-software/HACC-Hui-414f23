import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import DeleteFormWidget from '../../components/participant/DeleteFormWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const DeleteForm = () => (
  <div id={PAGE_IDS.DELETE_FORM}>
        <DeleteFormWidget/>
  </div>
);

export default withAllSubscriptions(DeleteForm);
