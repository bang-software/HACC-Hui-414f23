import { landingPage } from './landing.page';
import { agePage } from './age.page';
import { navBar } from './navbar.component';
import { signinPage } from './signinPage.page';
import { manageHaccWidgetComponents } from './manageHaccWidget.components';
import { underParticipationFormPage } from './underparticipationform.page';
import { signOutPage } from './signoutPage.page';
import { helpPage } from './help.page';
import { addChallengeAdminPage } from './addChallengeAdmin.page';
import { addSkillAdminPage } from './addSkillAdmin.page';
import { editChallengePage } from './editChallengePage.page';
import { participationForm } from './participationForm.page';
import { createProfilePage } from './createProfile.page';
/* global fixture:false, test:false */

const credentialsA = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const credentialsB = { username: 'john@foo.com', password: 'changeme' };
const credentialsC = { username: 'arslan@foo.com', password: 'changeme', firstName: 'Arslan', lastName: 'Qiu' };
const challenge = {
  title: 'Test Challenge',
  description: 'The description of the test challenge',
  submissionDetail: 'Submission details of the test challenge',
  pitch: 'this is my pitch for the test challenge',
};
const skill = {
  name: 'Test skill',
  description: 'The description of the test skill',
};

const editedChallenge = {
  description: 'The description of the edit challenge',
  submissionDetail: 'Submission details of the edit challenge',
  pitch: 'this is my pitch for the edit challenge',
};

fixture('meteor-application-template-react localhost test with default db')
    .page('http://localhost:3400');

/** USER --------------------------------------------------------------------------------------------------
test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that help page shows up', async (testController) => {
  await navBar.gotoHelpPage(testController);
  await helpPage.isDisplayed(testController);
});

test('Test that age page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await agePage.isDisplayed(testController);
});

test('Test that under participation page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await agePage.under18(testController);
  await underParticipationFormPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.isLoggedIn(testController, credentialsA.username);
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});
 */

test('Test that Participation Form page works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsC.username, credentialsC.password);
  await agePage.over18(testController);
  await participationForm.agreeToTerms(testController, credentialsC.firstName, credentialsC.lastName);
  await createProfilePage.isDisplayed(testController);
});

/** ADMIN -------------------------------------------------------------------------------------------------
test('Test that AddChallenge pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddChallengePage(testController);
  await addChallengeAdminPage.addChallenge(testController, challenge);
});

test('Test that AddSkill pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddSkillPage(testController);
  await addSkillAdminPage.addSkill(testController, skill);
});

test('Test that EditChallenge pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await editChallengePage.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, editedChallenge);
});
 */