import { Selector, t } from 'testcafe';
import { navBar } from './navbar.component';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class ChangeRolePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.CHANGE_ROLE}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Admin chooses user and assigns them a role of doctor and admin. */
  async changeRoleAssign(username) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.CHANGE_ROLE_FORM_EMAIL}`, username);
    await t.wait(500);
    await t.click(`#${COMPONENT_IDS.CHANGE_ROLE_FORM_DOCTOR_OPTION}`);
    await t.wait(500);
    await t.click(`#${COMPONENT_IDS.CHANGE_ROLE_FORM_ADMIN_OPTION}`);
    await t.wait(500);
    await t.click(`#${COMPONENT_IDS.CHANGE_ROLE_FORM_SUBMIT}`);
    await navBar.isLoggedIn(username);
  }
}

export const changeRolePage = new ChangeRolePage();
