import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class UpdateMPCompliant {
  constructor() {
    this.pageId = `#${PAGE_IDS.UPDATE_MP_COMPLIANT}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }
}

export const updateMPCompliant = new UpdateMPCompliant();
