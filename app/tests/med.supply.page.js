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

  /** User edits medicine. */
  async medEdit() {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_SEARCH}`, 'Tylenol');
    await t.wait(1000);
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_ADD}`);
    await t.typeText(`#${COMPONENT_IDS.MED_ADD_LOT_NUMBER}`, 'a32');
    const stateSelect = Selector(`#${COMPONENT_IDS.MED_ADD_STATE}`);
    await t.click(stateSelect);
    await t.click(stateSelect.find('option').withText('Acted'));
    await t.click(`#${COMPONENT_IDS.MED_ADD_EXP_DATE}`);
    await t.typeText(`#${COMPONENT_IDS.MED_ADD_EXP_DATE}`, '12/25/2022');
    await t.typeText(`#${COMPONENT_IDS.MED_ADD_SOURCE_NAME}`, 'CVS');
    const acquireSelect = Selector(`#${COMPONENT_IDS.MED_ADD_ACQUIRE}`);
    await t.click(acquireSelect);
    await t.click(acquireSelect.find('option').withText('Donated'));
    await t.typeText(`#${COMPONENT_IDS.MED_ADD_COST}`, '0');
    await t.typeText(`#${COMPONENT_IDS.MED_ADD_QUANTITY}`, '50');
    await t.wait(5000);
  }

  async medUpdate() {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_SEARCH}`, 'Tylenol');
    await t.wait(1000);
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_UPDATE}`);
    await t.typeText(`#${COMPONENT_IDS.MED_UPDATE_NAME}`, ' Pills');
    await t.typeText(`#${COMPONENT_IDS.MED_UPDATE_NOTE}`, '.  Do not take more than six within 24 hours!');
    await t.click(`#${COMPONENT_IDS.MED_UPDATE_SUBMIT}`);
    await t.wait(5000);
  }

  async medInfo() {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_SEARCH}`, 'Tylenol');
    await t.wait(1000);
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_INFO}`);
    await t.wait(5000);
  }

  async medDelete() {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_SEARCH}`, 'Tylenol');
    await t.wait(1000);
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_DELETE}`);
    await t.wait(5000);
  }

  /** User searches for added supply. */
  async supplySearch(supplyName) {
    await this.isDisplayed();
    await t.click(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_SUPPLY_TAB}`);
    await t.typeText(`#${COMPONENT_IDS.MEDICINE_AND_SUPPLIES_SUPPLY_SEARCH}`, supplyName);
  }
}

export const medSupplyPage = new MedSupplyPage();
