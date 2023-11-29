import { Role } from 'testcafe';
import { landingPage } from './landing.page';
import { agePage } from './age.page';
import { addChallengeAdminPage } from './manage_hacc_tests/addChallengeAdmin.page';
import { addSkillAdminPage } from './manage_hacc_tests/addSkillAdmin.page';
import { addToolAdminPage } from './manage_hacc_tests/addToolAdmin.page';
import { navBar } from './navbar.component';
import { signinPage } from './signinPage.page';
import { manageHaccWidgetComponents } from './manage_hacc_tests/manageHaccWidget.components';
import { underParticipationFormPage } from './underparticipationform.page';
import { helpPage } from './help.page';
import { editChallengePage } from './manage_hacc_tests/editChallengePage.page';
import { participationForm } from './participationForm.page';
import { createProfilePage } from './createProfile.page';
import { viewTeamsPage } from './viewTeamsPage.page';
import { suggestToolSkillPage } from './suggestToolSkillPage';
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
import { dumpDataBasePage } from './dumpDataBase.page';
import { memberTeamCard } from './memberTeamCard.component';
import { sideBar } from './sidebar.component';
import { teamMembership } from './teamMembership.component';
import { editProfilePage } from './editProfile.page';
import { editTeam } from './editTeam.component';
import { interestedParticipantsPage } from './interestedParticipants.page';
import { suggestionsListAdminPage } from './suggestionsListAdmin';
import { createTeamPage } from './createTeam.page';

/* global fixture:false, test:false */

const credentialsA = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const credentialsB = { username: 'john@foo.com', password: 'changeme' };

const credentialsC = { username: 'gsummey@hotmail.com', password: 'changeme' };

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

const editedTool = {
  name: 'New tool name',
  description: 'The description of the edit tool',
};

const suggestSkill = {
  name: 'New skill name',
  description: 'The description of the edit skill',
};

const suggestTool = {
  name: 'New tool name',
  description: 'The description of the edit tool',
};

const editedTeam = {
  name: 'New team name',
};

const userA = Role('http://localhost:3400/', async testController => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsA.username, credentialsA.password);
  await testController.wait(1000);
}, { preserveUrl: true });

const userC = Role('http://localhost:3400/', async testController => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsC.username, credentialsC.password);
  await testController.wait(1000);
}, { preserveUrl: true });

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3400');

test('Tests with no User', async (testController) => {
  // LandingPage
  await landingPage.isDisplayed(testController);
  // HelpPage
  await navBar.gotoHelpPage(testController);
  await helpPage.isDisplayed(testController);
});

test('Underage User Test', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await agePage.under18(testController);
  await underParticipationFormPage.isDisplayed(testController);
});

test('Regular User Test', async (testController) => {
  // ParticipationForm
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentialsB.username, credentialsB.password);
  await agePage.over18(testController);
  await participationForm.isDisplayed(testController);
  // DeleteForm
  await navBar.isLoggedIn(testController, credentialsB.username);
  await navBar.deleteAccount(testController);
  await deleteFormPage.isDisplayed(testController);
});

test('Tests for User C', async (testController) => {

  await testController.useRole(userC);
  // CreateProfilePage
  await createProfilePage.isDisplayed(testController);
  // ProfilePage
  await navBar.gotoProfilePage(testController);
  await profilePage.isDisplayed(testController);
  await profilePage.goToEditPage(testController);
  await editProfilePage.isDisplayed(testController);
  await navBar.gotoProfilePage(testController);
  await teamMembership.isDisplayed(testController);
  // CreateTeam
  await navBar.gotoCreateTeamPage(testController);
  await createTeamPage.isDisplayed(testController);
  // ListParticipants
  await navBar.gotoListParticipantsPage(testController);
  await listParticipantsPage.isDisplayed(testController);
  await listParticipantsCard.isDisplayed(testController);
  // SuggestToolSkill
  await navBar.gotoSuggestToolSkill(testController);
  await suggestToolSkillPage.isDisplayed(testController);
  await suggestToolSkillPage.suggestSkill(testController, suggestSkill);
  await suggestToolSkillPage.suggestTool(testController, suggestTool);
  // Sidebar
  await testController.resizeWindow(475, 667);
  await sideBar.gotoProfilePage(testController);
  await profilePage.isDisplayed(testController);
  await sideBar.gotoListParticipantsPage(testController);
  await sideBar.gotoSuggestToolSkillPage(testController);
  await suggestToolSkillPage.isDisplayed(testController);
  await sideBar.gotoTeamInvitationsPage(testController);
  await teamInvitationsPage.isDisplayed(testController);
  await testController.resizeWindow(1424, 1024);
  // YourTeams
  await navBar.gotoYourTeams(testController);
  await yourTeams.isDisplayed(testController);
  await yourTeamsCard.isDisplayed(testController);
  await memberTeamCard.isDisplayed(testController);
  await yourTeamsCard.see_interested_participants(testController);
  await interestedParticipantsPage.isDisplayed(testController);
  await navBar.gotoYourTeams(testController);
  await yourTeamsCard.open_edit_team_modal(testController);
  await editTeam.isDisplayed(testController);
});

test('Tests for User A', async (testController) => {
  await testController.useRole(userA);
  // Configure HACC
  await navBar.gotoConfigueHACC(testController);
  // must be clicked twice to revert back to original state
  await manageHaccWidgetComponents.clickCustomSwitched(testController);
  await manageHaccWidgetComponents.clickCustomSwitched(testController);
  // addChallenge
  await manageHaccWidgetComponents.gotoAddChallengePage(testController);
  await addChallengeAdminPage.addChallenge(testController, challenge);
  // editChallenge
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, editedChallenge);
  // addSkill
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddSkillPage(testController);
  await addSkillAdminPage.addSkill(testController, skill);
  // editSkill
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditSkillPage(testController);
  await editSkillPage.editSkill(testController, editedSkill);
  // addTool
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoAddToolPage(testController);
  await addToolAdminPage.addTool(testController, tool);
  // editTool
  await navBar.gotoConfigueHACC(testController);
  await manageHaccWidgetComponents.gotoEditToolPage(testController);
  await editToolPage.editTool(testController, editedTool);
  // UpdateMPStatus
  await navBar.gotoUpdateMP(testController);
  await updateMPCompliant.isDisplayed(testController);
  // SuggestionsList
  await navBar.gotoSuggestionsListAdmin(testController);
  await suggestionsListAdminPage.isDisplayed(testController);
  // ListParticipants
  await navBar.gotoListParticipantsAdminPage(testController);
  await listParticipantsAdminPage.isDisplayed(testController);
  await listParticipantsCardAdmin.isDisplayed(testController);
  // ViewTeams
  await navBar.gotoViewTeamsPage(testController);
  await viewTeamsPage.isDisplayed(testController);
  await viewTeamsPage.viewTeam(testController);
  await viewTeamsPage.editTeamAdmin(testController, editedTeam);
  // AllTeamsInvitations
  await navBar.gotoAllTeamInvitationsPage(testController);
  await allTeamInvitationsPage.isDisplayed(testController);
  // TeamsInvitations (Doesn't contain one)
  // await navBar.gotoTeamInvitations(testController);
  // await teamInvitationsPage.isDisplayed(testController);
  // DumpDatabase
  await navBar.gotoDumpDataBase(testController);
  await dumpDataBasePage.clickDumpDownload(testController);
});
