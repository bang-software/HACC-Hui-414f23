import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class AddChallengeAdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_CHALLENGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addChallenge(testController, challenge) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.ADD_CHALLENGE_TITLE}`, challenge.title);
    await testController.typeText(`#${COMPONENT_IDS.ADD_CHALLENGE_SUBMISSION_DETAIL}`, challenge.description);
    await testController.typeText(`#${COMPONENT_IDS.ADD_CHALLENGE_SUBMISSION_DETAIL}`, challenge.submissionDetail);
    await testController.typeText(`#${COMPONENT_IDS.ADD_CHALLENGE_PITCH}`, challenge.pitch);
    await testController.click(`#${COMPONENT_IDS.ADD_CHALLENGE_SUBMIT}`);
  }

}

export const addChallengeAdminPage = new AddChallengeAdminPage();
