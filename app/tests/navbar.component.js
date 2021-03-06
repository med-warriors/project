import { Selector, t } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout() {
    const loggedInUser = await Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await t.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
      await t.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoSigninPage() {
    await this.ensureLogout();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN}`);
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(username) {
    const loggedInUser = await Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).innerText;
    await t.expect(loggedInUser).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
  }

  /** Go to the view profile page. */
  async gotoViewProfilePage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_VIEW_PROFILE}`);
  }

  /** Go to the dispense page. */
  async gotoDispensePage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_DISPENSE}`);
  }

  /** Go to the add medicine page. */
  async gotoAddMedicinePage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_MEDICINE}`);
  }

  /** Go to the add supply page. */
  async gotoAddSupplyPage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_SUPPLIES}`);
  }

  /** Go to the medicine and supplies page. */
  async gotoMedSupplyPage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LIST_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_MEDICINE_AND_SUPPLIES}`);
  }

  /** Go to the record page. */
  async gotoRecordPage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LIST_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_RECORD}`);
  }

  /** Pull down login menu, go to sign up page. */
  async gotoSignupPage() {
    await this.ensureLogout();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP}`);
  }

  /** Go to the manage database page. Must be admin. */
  async gotoManageDatabasePage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE}`);
  }

  /** Go to the change role page. Must be admin. */
  async gotoChangeRolePage() {
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_CHANGE_ROLE}`);
  }
}

export const navBar = new NavBar();
