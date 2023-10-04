import { landingPage } from './landing.page';
import { agePage } from './age.page';
import { addChallengeAdminPage } from './addChallengeAdmin.page';
import { addSkillAdminPage } from './addSkillAdmin.page';
import { addToolAdminPage } from './addToolAdmin.page';
import { navBar } from './navbar.component';
import { signinPage } from './signinPage.page';
import { manageHaccWidgetComponents } from './manageHaccWidget.components';
import { underParticipationFormPage } from './underparticipationform.page';
import { signOutPage } from './signoutPage.page';
import { helpPage } from './help.page';
import { editChallengePage } from './editChallengePage.page';
import { participationForm } from './participationForm.page';
import { createProfilePage } from './createProfile.page';
import { viewTeamsPage } from './viewTeamsPage.page';
import { suggestToolSkillPage } from './suggestToolSkillPage.page';
import { profilePage } from './profilePage';
import { listParticipantsPage } from './listParticipants.page';
import { editSkillPage } from './editSkillPage.page';
/* global fixture:false, test:false */

const credentialsA = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const credentialsB = { username: 'john@foo.com', password: 'changeme' };
const credentialsC = { username: 'arslan@foo.com', password: 'changeme', firstName: 'Arslan', lastName: 'Qiu' };
const credentialsD = { username: 'gsummey@hotmail.com', password: 'changeme' };
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
const tool = {
  name: 'Test tool',
  description: 'The description of the test tool',
};

const editedChallenge = {
  description: 'The description of the edit challenge',
  submissionDetail: 'Submission details of the edit challenge',
  pitch: 'this is my pitch for the edit challenge',
};

const editedSkill = {
  name: 'New skill name',
  description: 'The description of the edit skill',
};

const profileInfo = {
  linkedin: 'Linkedin.com/usr/test',
  aboutMe: 'Im a Garth Summey',
};

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3400');

/** USER --------------------------------------------------------------------------------------------------*/

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that help page shows up', async (testController) => {
  await navBar.gotoHelpPage(testController);
  await helpPage.isDisplayed(testController);
});

test('Test that CreateProfile page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsD.username, credentialsD.password);
  await createProfilePage.isDisplayed(testController);
  // await createProfilePage.fillInfo(testController, profileInfo);
});

test('Test that ListParticipants page function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsD.username, credentialsD.password);
  await navBar.gotoListParticipantsPage(testController);
  await listParticipantsPage.isDisplayed(testController);
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

test('Test that participation form page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await agePage.over18(testController);
  await participationForm.isDisplayed(testController);
});

test('Test that suggest tool/skill renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await navBar.isLoggedIn(testController, credentialsB.username);
  await navBar.gotoSuggestToolSkill(testController);
  await suggestToolSkillPage.isDisplayed(testController);
});

test('Test that profile page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsC.username, credentialsC.password);
  await agePage.isDisplayed(testController);
  await agePage.under18(testController);
  await navBar.gotoProfilePage(testController);
  await profilePage.isDisplayed(testController);
});

/** ADMIN -------------------------------------------------------------------------------------------------*/
test('Test that AddChallenge page renders', async (testController) => {
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

test('Test that AddTool pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddToolPage(testController);
  await addToolAdminPage.addTool(testController, tool);
});

test('Test that EditChallenge pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, editedChallenge);
});

test('Test that EditSkill pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditSkillPage(testController);
  await editSkillPage.editSkill(testController, editedSkill);
});

test('Test that ViewTeams pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoViewTeamsPage(testController);
  await viewTeamsPage.clickFilter(testController);
});
