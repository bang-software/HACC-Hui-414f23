import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class DeleteFormPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DELETE_FORM}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }
}

export const deleteFormPage = new DeleteFormPage();
