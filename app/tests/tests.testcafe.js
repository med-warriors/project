import { t } from 'testcafe';
import { viewProfilePage, manageDatabasePage, signOutPage } from './simple.page';
import { signInPage } from './signin.page';
import { changeRolePage } from './change.role.page';
import { navBar } from './navbar.component';
// import { signUpPage } from './signup.page';
import { landingPage } from './landing.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
// const newCredentials = { firstName: 'Robert', lastName: 'Johnson', username: 'robert@foo.com', employeeID: '44444444', password: 'changeme', confirmPassword: 'changeme' };

fixture('matrp localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await t.wait(15000);
  await landingPage.isDisplayed();
});

test('Test that sign in and sign out work', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// commented out to prevent new credentials running every time the test runs
/* test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignupPage();
  await signUpPage.signupUser(newCredentials.firstName, newCredentials.lastName, newCredentials.username, newCredentials.employeeID, newCredentials.password, newCredentials.confirmPassword);
  await navBar.isLoggedIn(newCredentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
}); */

test('Test that user pages show up', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoViewProfilePage();
  await viewProfilePage.isDisplayed();
  await t.wait(500);
  await navBar.logout();
  await signOutPage.isDisplayed();
  await t.wait(1000);
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoViewProfilePage();
  await viewProfilePage.isDisplayed();
  await t.wait(500);
  await navBar.gotoManageDatabasePage();
  await manageDatabasePage.isDisplayed();
  await t.wait(500);
  await navBar.gotoChangeRolePage();
  await changeRolePage.changeRoleAssign('admin@foo.com');
});
