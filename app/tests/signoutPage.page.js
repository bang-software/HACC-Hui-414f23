import { Selector } from 'testcafe';

class SignOutPage {
  constructor() {
    this.pageId = '#signout-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to sign-out, then checks to see that login was successful. */

  async checkSignout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (!loggedInUser) {
      await testController.click('#navbar-sign-in');
    }
  }

  async signout(testController) {
    await this.isDisplayed(testController);
    await this.checkSignout(testController);
  }

}

export const signOutPage = new SignOutPage();
