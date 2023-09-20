import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class CreateProfilePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.CREATE_PROFILE}}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const createProfilePage = new CreateProfilePage();
