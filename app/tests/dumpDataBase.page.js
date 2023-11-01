import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';
import {COMPONENT_IDS} from "../imports/ui/testIDs/componentIDs";

class DumpDataBasePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DUMP_DATABASE}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(30000).expect(this.pageSelector.exists).ok();
  }

  async clickDumpDownload(testController) {
    await this.isDisplayed(testController);
    await testController.click(`#${COMPONENT_IDS.DUMP_DATABASE}`);
    await testController.click(`#${COMPONENT_IDS.DUMP_TEAM}`);
  }
}

export const dumpDataBasePage = new DumpDataBasePage();
