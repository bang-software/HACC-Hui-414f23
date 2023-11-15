import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class SideBar {
  constructor() {
    this.componentId = `#${COMPONENT_IDS.SIDEBAR_TOGGLE}`;
    this.pageSelector = Selector(this.componentId);
  }

  async toggleIsDisplayed(testController) {
    await testController.wait(3000).expect(this.pageSelector.exists).ok();
  }

  async isDisplayed(testController) {
    await testController.wait(3000).expect(`#${COMPONENT_IDS.SIDEBAR}`).ok();
  }

  async open(testController) {
    await testController.expect(this.pageSelector.visible).ok().click(this.pageSelector);
  }

  async close(testController) {
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_CLOSE_BUTTON}`).ok().click(`#${COMPONENT_IDS.SIDEBAR_CLOSE_BUTTON}`);
  }

  async gotoSigninPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_SIGN_IN}`).ok().click(`#${COMPONENT_IDS.SIDEBAR_SIGN_IN}`);
    await this.close(testController);
  }

  async gotoProfilePage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_PROFILE}`).ok().click(`#${COMPONENT_IDS.SIDEBAR_PROFILE}`);
    await this.close(testController);
  }

  async gotoYourTeamsPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_YOUR_TEAMS_BUTTON}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_YOUR_TEAMS_BUTTON}`);
    await this.close(testController);
  }

  async gotoListParticipantsPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS}`);
    await this.close(testController);
  }

  async gotoSuggestToolSkillPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_SUGGEST_TOOL_SKILL_BUTTON}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_SUGGEST_TOOL_SKILL_BUTTON}`);
    await this.close(testController);
  }

  async gotoTeamInvitationsPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_TEAM_INVITATIONS_BUTTON}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_TEAM_INVITATIONS_BUTTON}`);
    await this.close(testController);
  }

  async gotoConfigureHACCPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_CONFIGURE_HACC}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_CONFIGURE_HACC}`);
    await this.close(testController);
  }

  async gotoUpdateMPPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_UPDATE_MP}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_UPDATE_MP}`);
    await this.close(testController);
  }

  async gotoListParticipantsAdminPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS_ADMIN}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS_ADMIN}`);
    await this.close(testController);
  }

  async gotoHACCWidgetViewTeamsPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_VIEW_TEAMS_BUTTON}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_VIEW_TEAMS_BUTTON}`);
    await this.close(testController);
  }

  async gotoAllTeamInvitationsPage(testController) {
    await this.open(testController);
    await testController.expect(`#${COMPONENT_IDS.SIDEBAR_ALL_TEAM_INVITATIONS_NAV}`)
      .ok().click(`#${COMPONENT_IDS.SIDEBAR_ALL_TEAM_INVITATIONS_NAV}`);
    await this.close(testController);
  }

}

export const sideBar = new SideBar();
