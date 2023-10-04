import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class TeamInvitationsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.TEAM_INVITATIONS_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const teamInvitationsPage = new TeamInvitationsPage();
