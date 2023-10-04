import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditToolWidget from '../../components/administrator/EditToolWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const EditToolPage = () => (
    <div id={PAGE_IDS.EDIT_TOOL_PAGE}>
      <EditToolWidget />
    </div>
);

export default withAllSubscriptions(EditToolPage);
