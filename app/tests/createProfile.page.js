import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class CreateProfilePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.CREATE_PROFILE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }

  async fillInfo(testController, profileInfo) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.CREATE_PROFILE_LINKEDIN}`, profileInfo.linkedin);
    await testController.typeText(`#${COMPONENT_IDS.CREATE_PROFILE_ABOUTME}`, profileInfo.aboutMe);
    await testController.click(`#${COMPONENT_IDS.CREATE_PROFILE_CHALLENGES}`)
        .click(Selector('#react-select-2-option-0').withText('UH Building Security'));
    await testController.click(`#${COMPONENT_IDS.CREATE_PROFILE_SUBMIT}`);
  }
}

export const createProfilePage = new CreateProfilePage();
