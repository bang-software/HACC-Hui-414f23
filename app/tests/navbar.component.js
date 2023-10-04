import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoSigninPage(testController) {
    // await this.ensureLogout(testController);
    const visible = await Selector(`#${COMPONENT_IDS.LOGIN_DROPDOWN}`).visible;
    if (!visible) {
      await testController.click(`${COMPONENT_IDS.NAVBAR_TOGGLE}`);
    }
    await testController.click(`#${COMPONENT_IDS.LOGIN_DROPDOWN}`);
    await testController.click(`#${COMPONENT_IDS.LOGIN_DROPDOWN_SIGN_IN}`);
  }

  async gotoHelpPage(testController) {
    const visible = await Selector(`#${COMPONENT_IDS.HELP_BUTTON}`).visible;
    if (!visible) {
      await testController.click(`${COMPONENT_IDS.NAVBAR_TOGGLE}`);
    }
    await testController.click(`#${COMPONENT_IDS.HELP_BUTTON}`);
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, username) {
    const loggedInUser = Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).innerText;
    await testController.expect(loggedInUser).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    await testController.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await testController.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
    await testController.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
  }

  async deleteAccount(testController) {
    await testController.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await testController.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
    await testController.click(`#${COMPONENT_IDS.DELETE_ACCOUNT_NAV}`);
  }

  async gotoProfilePage(testController) {
    await testController.expect(Selector(`#${COMPONENT_IDS.PROFILE}`).exists).ok();
    await testController.click(`#${COMPONENT_IDS.PROFILE}`);
  }

  /** Feeling Hungry Page */
  async gotoConfigueHACC(testController) {
    const visible = await Selector(`#${COMPONENT_IDS.CONFIGURE_HACC}`).visible;
    if (!visible) {
      await testController.click(`${COMPONENT_IDS.NAVBAR_TOGGLE}`);
    }
    await testController.click(`#${COMPONENT_IDS.CONFIGURE_HACC}`);
  }

  /** Go to suggest/tool skill */
  async gotoSuggestToolSkill(testController) {
    const visible = await Selector(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_BUTTON}`).visible;
    if (!visible) {
      await testController.click(`${COMPONENT_IDS.NAVBAR_TOGGLE}`);
    }
    await testController.click(`#${COMPONENT_IDS.SUGGEST_TOOL_SKILL_BUTTON}`);
  }

  async gotoListParticipantsPage(testController) {
    await testController.expect(Selector(`#${COMPONENT_IDS.LIST_PARTICIPANTS}`).exists).ok();
    await testController.click(`#${COMPONENT_IDS.LIST_PARTICIPANTS}`);
  }

  async gotoTeamInvitations(testController) {
    await testController.expect(Selector(`#${COMPONENT_IDS.TEAM_INVITATIONS_BUTTON}`).exists).ok();
    await testController.click(`#${COMPONENT_IDS.TEAM_INVITATIONS_BUTTON}`);
  }

  async gotoUpdateMP(testController) {
    const visible = await Selector(`#${COMPONENT_IDS.UPDATE_MP}`).visible;
    if (!visible) {
      await testController.click(`${COMPONENT_IDS.NAVBAR_TOGGLE}`);
    }
    await testController.click(`#${COMPONENT_IDS.UPDATE_MP}`);
  }
}

export const navBar = new NavBar();
