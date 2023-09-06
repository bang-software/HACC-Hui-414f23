import { landingPage } from './landing.page';
import { addChallengeAdminPage } from './addChallengeAdmin.page';
import { navBar } from './navbar.component';
import { signinPage } from './signinPage.page';
import { manageHaccWidgetComponents } from './manageHaccWidget.components';
/* global fixture:false, test:false */

const credentialsA = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const challenge = {
  title: 'Test Challenge',
  description: 'The description of the test challenge',
  submissionDetail: 'Submission details of the test challenge',
  pitch: 'this is my pitch for the test challenge',
};

fixture('meteor-application-template-react localhost test with default db')
    .page('http://localhost:3400');

/** USER --------------------------------------------------------------------------------------------------*/
 test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

/** ADMIN -------------------------------------------------------------------------------------------------*/
test('Test that Admin pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddChallengePage(testController);
  await addChallengeAdminPage.addChallenge(testController, challenge);
});
