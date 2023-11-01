import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class TeamMembership {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.TEAM_MEMBERSHIP_WIDGET}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const teamMembership = new TeamMembership();
