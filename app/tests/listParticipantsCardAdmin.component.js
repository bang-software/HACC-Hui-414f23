import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ListParticipantCardAdmin {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.LIST_PARTICIPANTS_CARD_ADMIN}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(15000).expect(this.pageSelector.exists).ok();
  }
}

export const listParticipantsCardAdmin = new ListParticipantCardAdmin();
