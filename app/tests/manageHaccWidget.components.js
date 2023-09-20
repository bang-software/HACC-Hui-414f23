import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ManageHaccWidgetComponents {
  constructor() {
    this.pageId = `#${PAGE_IDS.MANAGE_HACC_WIDGET_COMPONENT}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoAddChallengePage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_CHALLENGE_BUTTON}`);
  }

  async gotoEditChallengePage(testController) {
    await testController.click(`#${COMPONENT_IDS.EDIT_CHALLENGE_BUTTON}`);
  }

  async gotoAddSkillPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_SKILL_BUTTON}`);
  }

  async gotoAddToolPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_SKILL_BUTTON}`);
  }
}

export const manageHaccWidgetComponents = new ManageHaccWidgetComponents();
