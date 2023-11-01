import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class TeamCard {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.TEAM_CARD}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const teamCard = new TeamCard();
