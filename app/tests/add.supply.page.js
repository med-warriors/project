import { Selector, t } from 'testcafe';
// import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class AddSupplyPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_SUPPLY}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** User fills out add supplies form. */
  async fillOutAddSupply(supplyName, supplyNote) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.ADD_SUPPLIES_FORM_NAME}`, supplyName);
    const locationSelect = Selector(`#${COMPONENT_IDS.ADD_SUPPLIES_FORM_LOCATION}`);
    await t.click(locationSelect);
    await t.click(locationSelect.find('option').withText('Drawer 6'));
    await t.typeText(`#${COMPONENT_IDS.ADD_SUPPLIES_FORM_NOTE}`, supplyNote);
  }
}

export const addSupplyPage = new AddSupplyPage();
