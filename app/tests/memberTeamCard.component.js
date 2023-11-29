import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class MemberTeamCard {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.MEMBER_TEAM_CARD}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const memberTeamCard = new MemberTeamCard();
