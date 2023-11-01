import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ProfilePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.PROFILE_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async goToEditPage(testController) {
    await testController.click(`#${COMPONENT_IDS.EDIT_PROFILE_BUTTON}`);
  }
}

export const profilePage = new ProfilePage();
