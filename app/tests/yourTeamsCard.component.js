import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class YourTeamsCard {
    constructor() {
        this.componentId = `#${COMPONENT_IDS.YOUR_TEAMS_CARD}`;
        this.pageSelector = Selector(this.componentId);
    }

    async isDisplayed(testController) {
        await testController.wait(5000).expect(this.pageSelector.exists).ok();
    }

    async invite_participants(testController, tool) {
        await this.isDisplayed(testController);
        await testController.click(`#${COMPONENT_IDS.OPEN_INVITE_PARTICIPANTS}`);
        await testController.typeText(`#${COMPONENT_IDS.INVITE_PARTICIPANTS_TEXTFIELD}`, tool.email);
        await testController.click(`#${COMPONENT_IDS.INVITE_PARTICIPANTS_SUBMIT}`);
        await this.isDisplayed(testController);
    }

    async see_interested_participants(testController) {
        await this.isDisplayed(testController);
        await testController.click(`#${COMPONENT_IDS.SEE_INTERTESTED_PARTICIPANTS}`);
        await this.isDisplayed(testController);
    }
}

export const yourTeamsCard = new YourTeamsCard();
