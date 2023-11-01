import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class NotFoundPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.NOT_FOUND}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async gotoNonPage(testController) {
    await testController.navigateTo('/aaaaaaaaaaaaaaaaa');
  }
}

/* TODO: Put into tests.testcafe.js, if you can get it working.
test('Test that not found page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
  await notFoundPage.gotoNonPage(testController);
  await notFoundPage.isDisplayed(testController);
});
*/

export const notFoundPage = new NotFoundPage();
