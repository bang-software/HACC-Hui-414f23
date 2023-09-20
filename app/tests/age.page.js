import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class AgePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.AGE_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async under18(testController) {
    await testController.click(`#${COMPONENT_IDS.AGE_PAGE_NO_BUTTON}`);
  }

  async over18(testController) {
    await testController.click(`#${COMPONENT_IDS.AGE_PAGE_YES_BUTTON}`);
  }
}

export const agePage = new AgePage();
