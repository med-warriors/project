import { Selector, t } from 'testcafe';
// import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class DispensePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DISPENSE}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** User fills out dispense form. */
  async fillOutDispense(dispenseName, patientID, dispenseLocation, dispenseNote) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_SEARCH}`, dispenseName);
    await t.click(`#${COMPONENT_IDS.DISPENSE_ADD}`);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_QUANTITY}`, '8');
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_ID}`, patientID);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_LOCATION}`, dispenseLocation);
    await t.typeText(`#${COMPONENT_IDS.DISPENSE_NOTE}`, dispenseNote);
    await t.click(`#${COMPONENT_IDS.DISPENSE_SUBMIT}`);
    await t.wait(5000);
  }
}

export const dispensePage = new DispensePage();
