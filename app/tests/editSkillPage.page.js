import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class EditSkillPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.EDIT_SKILL_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async editSkill(testController, editedSkill) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.EDIT_SKILL_NAME}`, editedSkill.name, { replace: true });
    await testController.typeText(`#${COMPONENT_IDS.EDIT_SKILL_DESCRIPTION}`, editedSkill.description, { replace: true });
    await testController.click(`#${COMPONENT_IDS.EDIT_SKILL_SUBMIT}`);
  }
}

export const editSkillPage = new EditSkillPage();
