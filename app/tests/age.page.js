import { Selector } from 'testcafe';

class AgePage {
  constructor() {
    this.pageId = '#age';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const agePage = new AgePage();
