import { Selector } from 'testcafe';

class AddChallengeAdminPage {
  constructor() {
    this.pageId = '#addChallenge';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addChallenge(testController, challenge) {
    await this.isDisplayed(testController);
    await testController.typeText('#addChallenge-title', challenge.title);
    await testController.typeText('#addChallenge-description', challenge.description);
    await testController.typeText('#addChallenge-submissionDetail', challenge.submissionDetail);
    await testController.typeText('#addChallenge-pitch', challenge.pitch);
    await testController.click('#addChallenge-submit');
  }

}

export const addChallengeAdminPage = new AddChallengeAdminPage();
