import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class AddSkillAdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_SKILL}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addSkill(testController, skill) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.ADD_SKILL_NAME}`, skill.name);
    await testController.typeText(`#${COMPONENT_IDS.ADD_SKILL_DESCRIPTION}`, skill.description);
    await testController.click(`#${COMPONENT_IDS.ADD_SKILL_SUBMIT}`);
  }

}

export const addSkillAdminPage = new AddSkillAdminPage();
