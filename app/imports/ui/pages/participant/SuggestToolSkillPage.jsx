import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import SuggestToolSkillWidget from '../../components/participant/SuggestToolSkillWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const SuggestToolSkillPage = () => (
    <div id={PAGE_IDS.SUGGEST_TOOL_SKILL}>
        <SuggestToolSkillWidget />
    </div>
);

export default withAllSubscriptions(SuggestToolSkillPage);
