import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class SignOutPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SIGN_OUT}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const signOutPage = new SignOutPage();
