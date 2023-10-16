import { Selector } from 'testcafe';
import { PAGE_IDS } from '../../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../../imports/ui/testIDs/componentIDs';

class AddToolAdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_TOOL}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addTool(testController, tool) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.ADD_TOOL_NAME}`, tool.name);
    await testController.typeText(`#${COMPONENT_IDS.ADD_TOOL_DESCRIPTION}`, tool.description);
    await testController.click(`#${COMPONENT_IDS.ADD_TOOL_SUBMIT}`);
  }

}

export const addToolAdminPage = new AddToolAdminPage();
