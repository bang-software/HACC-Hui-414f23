import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class SuggestToolSkillPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SUGGEST_TOOL_SKILL}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const suggestToolSkillPage = new SuggestToolSkillPage();
