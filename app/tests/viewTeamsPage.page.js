import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class ViewTeamsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.VIEW_TEAMS_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async isDownloaded(testController) {
    await testController.click(`#${COMPONENT_IDS.DOWNLOAD_TEAM_CAPTAIN_EMAILS}`);
  }

  async clickFilter(testController) {
    await this.isDisplayed(testController);
    await this.isDownloaded(testController);
    await testController.click(`#${COMPONENT_IDS.FILTER_NON_COMPLIANT}`);
    await testController.click(`#${COMPONENT_IDS.FILTER_NO_DEV_POST}`);
    await testController.click(`#${COMPONENT_IDS.FILTER_NO_GITHUB}`);
    await testController.click(`#${COMPONENT_IDS.FILTER_NONE}`);
  }

  async viewTeam(testController) {
    await testController.click(`#${COMPONENT_IDS.VIEW_TEAM_CARD}`);
  }

  async editTeamAdmin(testController, testcase) {
    await testController.click(`#${COMPONENT_IDS.EDIT_TEAM_BUTTON_ADMIN}`);
    await testController.click(`#${COMPONENT_IDS.EDIT_TEAM_SUBMIT_ADMIN}`);
  }

}

export const viewTeamsPage = new ViewTeamsPage();
