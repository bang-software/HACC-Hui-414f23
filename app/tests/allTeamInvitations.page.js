import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class AllTeamInvitationsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ALL_TEAM_INVITATIONS}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const allTeamInvitationsPage = new AllTeamInvitationsPage();