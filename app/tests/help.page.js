import { Selector } from 'testcafe';

class HelpPage {
  constructor() {
    this.pageId = '#help-page';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const helpPage = new HelpPage();
