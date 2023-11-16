import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class SuggestionsListAdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_SUGGESTIONS_ADMIN}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(15000).expect(this.pageSelector.exists).ok();
  }
}

export const suggestionsListAdminPage = new SuggestionsListAdminPage();
