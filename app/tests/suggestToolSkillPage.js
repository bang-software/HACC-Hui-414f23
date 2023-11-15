import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class SuggestToolSkillPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SUGGEST_TOOL_SKILL}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }

  async suggestSkill(testController, skill) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_NAME}`, skill.name);
    await testController.click(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_SELECT}`);
    await testController.pressKey('down');
    await testController.pressKey('down');
    await testController.pressKey('enter');
    await testController.typeText(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_DESCRIPTION}`, skill.description);
    await testController.pressKey('tab');
    await testController.pressKey('enter');
    await testController.pressKey('enter');
  }

  async suggestTool(testController, tool) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_NAME}`, tool.name);
    await testController.click(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_SELECT}`);
    await testController.pressKey('down');
    await testController.pressKey('enter');
    await testController.typeText(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_DESCRIPTION}`, tool.description);
    await testController.click(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_SUBMIT}`);
    await testController.pressKey('enter');
    await testController.pressKey('enter');
  }

}

export const suggestToolSkillPage = new SuggestToolSkillPage();
