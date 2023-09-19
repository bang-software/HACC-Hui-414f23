import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class UnderParticipationForm {
  constructor() {
    this.pageId = `#${PAGE_IDS.UNDER_AGE_PARTICIPATION_FORM}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const underParticipationFormPage = new UnderParticipationForm();
