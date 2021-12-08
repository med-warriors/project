import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class RecordPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_RECORD}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** User navigates through record page based on tabs. */
  async navigateRecord() {
    await this.isDisplayed();
    await t.wait(2000);
    await t.click(`#${COMPONENT_IDS.RECORD_SUPPLY_TAB}`);
    await t.wait(2000);
    await t.click(`#${COMPONENT_IDS.RECORD_DISPENSE_TAB}`);
    await t.wait(2000);
  }
}

export const recordPage = new RecordPage();
