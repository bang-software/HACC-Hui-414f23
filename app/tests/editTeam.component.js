import { Selector } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/testIDs/componentIDs';

class EditTeam {
    constructor() {
        this.componentId = `#${COMPONENT_IDS.EDIT_TEAM}`;
        this.pageSelector = Selector(this.componentId);
    }

    async isDisplayed(testController) {
        await testController.wait(5000).expect(this.pageSelector.exists).ok();
    }
}

export const editTeam = new EditTeam();
