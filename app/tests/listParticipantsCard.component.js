import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ListParticipantCard {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.LIST_PARTICIPANTS_CARD}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }
}

export const listParticipantsCard = new ListParticipantCard();
