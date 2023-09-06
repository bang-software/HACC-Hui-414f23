import { Selector } from 'testcafe';

class ManageHaccWidgetComponents {
  constructor() {
    this.pageId = '#Hacc-Widget';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoAddChallengePage(testController) {
    await testController.click('#addChallengeButton');
  }
}

export const manageHaccWidgetComponents = new ManageHaccWidgetComponents();
