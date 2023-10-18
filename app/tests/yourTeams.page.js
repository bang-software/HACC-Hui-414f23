import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class YourTeamsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.YOUR_TEAMS}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }
}

export const yourTeams = new YourTeamsPage();
