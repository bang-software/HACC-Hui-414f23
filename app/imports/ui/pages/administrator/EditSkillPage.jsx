import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditSkillWidget from '../../components/administrator/EditSkillWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const EditSkillPage = () => (
    <div id={PAGE_IDS.EDIT_SKILL_PAGE}>
      <EditSkillWidget />
    </div>
);

export default withAllSubscriptions(EditSkillPage);
