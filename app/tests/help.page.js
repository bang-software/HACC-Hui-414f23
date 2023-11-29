import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class HelpPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.HELP_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const helpPage = new HelpPage();
