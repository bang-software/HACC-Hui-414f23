import { Selector } from 'testcafe';

class LandingPage {
  constructor() {
    this.pageId = '#landing';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const landingPage = new LandingPage();
