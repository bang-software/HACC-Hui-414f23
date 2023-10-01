import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class ListParticipantsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_PARTICIPANTS}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(15000).expect(this.pageSelector.exists).ok();
  }
}

export const listParticipantsPage = new ListParticipantsPage();
