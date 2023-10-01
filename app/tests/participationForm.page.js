import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ParticipationFormPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.PARTICIPATION_FORM}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async agreeToTerms(testController, firstName, lastName) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.PARTICIPATION_FORM_FIRST_NAME}`, firstName);
    await testController.typeText(`#${COMPONENT_IDS.PARTICIPATION_FORM_LAST_NAME}`, lastName);
    await testController.click(`#${COMPONENT_IDS.PARTICIPATION_FORM_AGREE_BUTTON}`);
    await testController.click(`#${COMPONENT_IDS.PARTICIPATION_FORM_SUBMIT}`);
  }
}

export const participationForm = new ParticipationFormPage();
