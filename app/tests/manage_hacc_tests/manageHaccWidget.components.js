import { Selector } from 'testcafe';
import { PAGE_IDS } from '../../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../../imports/ui/testIDs/componentIDs';

class ManageHaccWidgetComponents {
  constructor() {
    this.pageId = `#${PAGE_IDS.MANAGE_HACC_WIDGET_COMPONENT}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async clickCustomSwitched(testContoller) {
    await testContoller.click(`#${COMPONENT_IDS.HACC_WIDGET_CUSTOM_SWITCH_TEAMS}`);
    await testContoller.click(`#${COMPONENT_IDS.HACC_WIDGET_CUSTOM_SWITCH_CHALLENGES}`);
  }

  async gotoAddChallengePage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_CHALLENGE}`);
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_CHALLENGE_BUTTON}`);
  }

  async gotoAddSkillPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_SKILL}`);
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_SKILL_BUTTON}`);
  }

  async gotoAddToolPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_TOOl}`);
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_ADD_TOOL_BUTTON}`);
  }

  async gotoEditChallengePage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_CHALLENGE}`);
    await testController.click(`#${COMPONENT_IDS.EDIT_CHALLENGE_BUTTON}`);
  }

  async gotoEditSkillPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_SKILL}`);
    await testController.click(`#${COMPONENT_IDS.EDIT_SKILL_BUTTON}`);
  }

  async gotoEditToolPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_NAV_TOOl}`);
    await testController.click(`#${COMPONENT_IDS.EDIT_TOOL_BUTTON}`);
  }

  async gotoViewTeamsPage(testController) {
    await testController.click(`#${COMPONENT_IDS.HACC_WIDGET_VIEW_TEAMS_BUTTON}`);
  }
}

export const manageHaccWidgetComponents = new ManageHaccWidgetComponents();
