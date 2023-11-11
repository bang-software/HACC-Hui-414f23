import { Selector } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/testIDs/pageIDs';

class BestFitTeam {
  constructor() {
    this.componentId = `#${PAGE_IDS.BEST_FIT_TEAM}`;
    this.pageSelector = Selector(this.componentId);
  }

  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const bestFitTeam = new BestFitTeam();
