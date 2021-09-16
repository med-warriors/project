import { Selector, t } from 'testcafe';
import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class SignupPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SIGN_UP}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Signs up a new user, then checks to see that they are logged in by checking the navbar. */
  async signupUser(firstName, lastName, username, employeeID, password, confirmPassword) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_FIRSTNAME}`, firstName);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_LASTNAME}`, lastName);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_EMAIL}`, username);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEEID}`, employeeID);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}`, password);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_CONFIRMPASSWORD}`, confirmPassword);
    await t.click(`#${COMPONENT_IDS.SIGN_UP_FORM_SUBMIT}`);
    await navBar.isLoggedIn(username);
  }
}

export const signUpPage = new SignupPage();
