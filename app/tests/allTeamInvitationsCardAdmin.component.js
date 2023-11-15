import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class AllTeamInvitationsCardAdmin {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.ALL_TEAM_INVITATIONS_CARD_ADMIN}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(15000).expect(this.pageSelector.exists).ok();
  }
}

export const allTeamInvitationsCardAdmin = new AllTeamInvitationsCardAdmin();
