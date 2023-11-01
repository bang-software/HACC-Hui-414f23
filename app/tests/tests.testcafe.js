import { landingPage } from './landing.page';
import { agePage } from './age.page';
import { addChallengeAdminPage } from './manage_hacc_tests/addChallengeAdmin.page';
import { addSkillAdminPage } from './manage_hacc_tests/addSkillAdmin.page';
import { addToolAdminPage } from './manage_hacc_tests/addToolAdmin.page';
import { navBar } from './navbar.component';
import { signinPage } from './signinPage.page';
import { manageHaccWidgetComponents } from './manage_hacc_tests/manageHaccWidget.components';
import { underParticipationFormPage } from './underparticipationform.page';
import { signOutPage } from './signoutPage.page';
import { helpPage } from './help.page';
import { editChallengePage } from './manage_hacc_tests/editChallengePage.page';
import { participationForm } from './participationForm.page';
import { createProfilePage } from './createProfile.page';
import { viewTeamsPage } from './viewTeamsPage.page';
import { suggestToolSkillPage } from './suggestToolSkillPage.page';
import { profilePage } from './profilePage';
import { listParticipantsPage } from './listParticipants.page';
import { teamInvitationsPage } from './teamInvitationsPage';
import { editSkillPage } from './manage_hacc_tests/editSkillPage.page';
import { editToolPage } from './manage_hacc_tests/editToolPage.page';
import { updateMPCompliant } from './updateMPCompliant.page';
import { deleteFormPage } from './deleteForm.page';
import { listParticipantsAdminPage } from './listParticipantsAdmin.page';
import { listParticipantsCardAdmin } from './listParticipantsCardAdmin.component';
import { listParticipantsCard } from './listParticipantsCard.component';
import { yourTeams } from './yourTeams.page';
import { allTeamInvitationsPage } from './allTeamInvitations.page';
import { yourTeamsCard } from './yourTeamsCard.component';
import { dumpDataBasePage } from "./dumpDataBase.page";
import { memberTeamCard } from './memberTeamCard.component';
import { teamCard } from './teamCard.component';
import { teamMembership } from './teamMembership.component';
import { editProfilePage } from './editProfile.page';

/* global fixture:false, test:false */

const credentialsA = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const credentialsB = { username: 'john@foo.com', password: 'changeme' };
const credentialsC = { username: 'arslan@foo.com', password: 'changeme', firstName: 'Arslan', lastName: 'Qiu' };
const credentialsD = { username: 'gsummey@hotmail.com', password: 'changeme' };
const credentialsE = { username: 'jenny@foo.com', password: 'changeme' };
const credentialsF = { username: 'aung@foo.com', password: 'changeme' };

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

const invite = {
  email: 'aung@foo.com',
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

const editedTool = {
  name: 'New tool name',
  description: 'The description of the edit tool',
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
  await listParticipantsCard.isDisplayed(testController);
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
  await profilePage.goToEditPage(testController);
  await editProfilePage.isDisplayed(testController);
  await navBar.gotoProfilePage(testController);
});

test('Test delete form renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await navBar.isLoggedIn(testController, credentialsB.username);
  await navBar.deleteAccount(testController);
  await deleteFormPage.isDisplayed(testController);
});

test('Test that your teams page shows up', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsF.username, credentialsF.password);
  await navBar.gotoYourTeams(testController);
  await yourTeams.isDisplayed(testController);
  await yourTeamsCard.isDisplayed(testController);
});

/** ADMIN -------------------------------------------------------------------------------------------------*/
test('Test that ListParticipantsAdmin page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoListParticipantsAdminPage(testController);
  await listParticipantsAdminPage.isDisplayed(testController);
  await listParticipantsCardAdmin.isDisplayed(testController);
});
test('Test that ManageHacc page shows and toggles switches', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  // must be clicked twice to revert back to original state
  await manageHaccWidgetComponents.clickCustomSwitched(testController);
  await manageHaccWidgetComponents.clickCustomSwitched(testController);
});
test('Test that AddChallenge page function', async (testController) => {
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

test('Test that EditChallenge page function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, editedChallenge);
});

test('Test that EditSkill page function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditSkillPage(testController);
  await editSkillPage.editSkill(testController, editedSkill);
});

test('Test that EditTool page function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditToolPage(testController);
  await editToolPage.editTool(testController, editedTool);
});

test('Test that ViewTeams pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.isDisplayed(testController);
});

test('Test that AllTeamInvitations pages function', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoAllTeamInvitationsPage(testController);
  await allTeamInvitationsPage.isDisplayed(testController);
});

test('Test that TeamInvitations page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await navBar.gotoTeamInvitations(testController);
  await teamInvitationsPage.isDisplayed(testController);
});

test('Test that UpdateMinorParticipantsCompliant page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoUpdateMP(testController);
  await updateMPCompliant.isDisplayed(testController);
});

test('Test that Dump DataBase page renders', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await navBar.gotoDumpDataBase(testController);
  await dumpDataBasePage.clickDumpDownload(testController);
});