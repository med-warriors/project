import { Selector, t } from 'testcafe';
// import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class MedSupplyPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_MEDICINES}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** User searches for added medicine. */
  async medSearch(medName) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_SEARCH}`, medName);
  }

  /** User searches for added supply. */
  async supplySearch(supplyName) {
    await this.isDisplayed();
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_SUPPLY_TAB}`);
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_SUPPLY_SEARCH}`, supplyName);
  }
}

export const medSupplyPage = new MedSupplyPage();
