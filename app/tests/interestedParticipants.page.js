import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class InterestedParticipantsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.INTERESTED_PARTICIPANTS}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }
}

export const interestedParticipantsPage = new InterestedParticipantsPage();
