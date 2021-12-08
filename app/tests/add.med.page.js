import { Selector, t } from 'testcafe';
// import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class AddMedPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_MEDICINE}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** User fills out add medicine form. */
  async fillOutAddMed(medName, medCount, medNote) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_NAME}`, medName);
    const typeSelect = Selector(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_TYPE}`);
    await t.click(typeSelect);
    await t.click(typeSelect.find('option').withText('Allergy & Cold Medicines'));
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_QUANTITY}`, medCount);
    const locationSelect = Selector(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_LOCATION}`);
    await t.click(locationSelect);
    await t.click(locationSelect.find('option').withText('Case 2'));
    await t.typeText(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_NOTE}`, medNote);
    await t.click(`#${COMPONENT_IDS.ADD_MEDICINE_FORM_SUBMIT}`);
  }
}

export const addMedPage = new AddMedPage();
