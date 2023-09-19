import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';
// import { navBar } from './navbar.component';

class SigninPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SIGN_IN}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async signin(testController, username, password) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.SIGN_IN_FORM_EMAIL}`, username);
    await testController.typeText(`#${COMPONENT_IDS.SIGN_IN_FORM_PASSWORD}`, password);
    await testController.click(`#${COMPONENT_IDS.SIGN_IN_FORM_SUBMIT}`);
    // await navBar.isLoggedIn(testController, username);
  }
}

export const signinPage = new SigninPage();
