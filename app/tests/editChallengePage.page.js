import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class EditChallengePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.EDIT_CHALLENGE_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async gotoEditChallengePage(testController) {
    await testController.click(`#${COMPONENT_IDS.EDIT_CHALLENGE_BUTTON}`);
  }

  async editChallenge(testController, editedChallenge) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.EDIT_CHALLENGE_DESCRIPTION}`, editedChallenge.description, { replace: true });
    await testController.typeText(
        `#${COMPONENT_IDS.EDIT_CHALLENGE_SUBMISSION_DETAIL}`, editedChallenge.submissionDetail, { replace: true },
    );
    await testController.typeText(`#${COMPONENT_IDS.EDIT_CHALLENGE_PITCH}`, editedChallenge.pitch, { replace: true });
    await testController.click(`#${COMPONENT_IDS.EDIT_CHALLENGE_SUBMIT}`);
  }
}

export const editChallengePage = new EditChallengePage();
