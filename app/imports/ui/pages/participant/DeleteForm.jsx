import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import DeleteFormWidget from '../../components/participant/DeleteFormWidget';

const DeleteForm = () => (
  <div>
        <DeleteFormWidget/>
  </div>
);

export default withAllSubscriptions(DeleteForm);
