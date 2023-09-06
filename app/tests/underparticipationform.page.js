import { Selector } from 'testcafe';

class UnderParticipationForm {
  constructor() {
    this.pageId = '#under-participation';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const underParticipationFormPage = new UnderParticipationForm();
