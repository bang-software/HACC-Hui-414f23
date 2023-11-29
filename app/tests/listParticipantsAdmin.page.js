import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class ListParticipantsAdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_PARTICIPANTS_ADMIN}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const listParticipantsAdminPage = new ListParticipantsAdminPage();
