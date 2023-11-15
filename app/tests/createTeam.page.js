import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class CreateTeamPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.CREATE_TEAM}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }

  async submitTeam(testController, teamInfo) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.CREATE_TEAM_NAME}`, teamInfo.name);
    await testController.click(`#${COMPONENT_IDS.CREATE_TEAM_OPEN}`)
        .click(Selector('#react-select-2-option-0').withText('Open'));
    await testController.typeText(`#${COMPONENT_IDS.CREATE_TEAM_DESCRIPTION}`, teamInfo.description);
    await testController.click(`#${COMPONENT_IDS.CREATE_TEAM_CHALLENGE}`)
        .click(Selector('#react-select-2-option-0').withText('Family Resource Directory'));
    await testController.click(`#${COMPONENT_IDS.CREATE_TEAM_SKILLS}`)
        .click(Selector('#react-select-2-option-0').withText('Videography'))
        .click(Selector('#react-select-2-option-0').withText('User Interface Design'));
    await testController.click(`#${COMPONENT_IDS.CREATE_TEAM_TOOLS}`)
        .click(Selector('#react-select-2-option-0').withText('Java'))
        .click(Selector('#react-select-2-option-0').withText('Python'));
    await testController.typeText(`#${COMPONENT_IDS.CREATE_TEAM_DEVPOST}`, teamInfo.devpost);
    await testController.typeText(`#${COMPONENT_IDS.CREATE_TEAM_AFFILIATION}`, teamInfo.affiliation);
    await testController.click(`#${COMPONENT_IDS.CREATE_TEAM_SUBMIT}`);
  }
}

export const createTeamPage = new CreateTeamPage();
