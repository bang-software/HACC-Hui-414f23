import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class EditProfilePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.EDIT_PROFILE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const editProfilePage = new EditProfilePage();
