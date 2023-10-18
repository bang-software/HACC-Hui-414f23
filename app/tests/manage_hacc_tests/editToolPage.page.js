import { Selector } from 'testcafe';
import { PAGE_IDS } from '../../imports/ui/testIDs/pageIDs';
import { COMPONENT_IDS } from '../../imports/ui/testIDs/componentIDs';

class EditToolPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.EDIT_TOOL_PAGE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async editTool(testController, editedTool) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENT_IDS.EDIT_TOOL_NAME}`, editedTool.name, { replace: true });
    await testController.typeText(`#${COMPONENT_IDS.EDIT_TOOL_DESCRIPTION}`, editedTool.description, { replace: true });
    await testController.click(`#${COMPONENT_IDS.EDIT_TOOL_SUBMIT}`);
  }
}

export const editToolPage = new EditToolPage();
