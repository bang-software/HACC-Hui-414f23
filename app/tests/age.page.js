import { Selector } from 'testcafe';

class AgePage {
  constructor() {
    this.pageId = '#age';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async under18(testController) {
    await testController.click('#no-button');
  }
}

export const agePage = new AgePage();
