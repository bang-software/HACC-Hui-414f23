import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
// import _ from 'lodash';
import { BoxArrowRight, PersonFill, PersonFillX } from 'react-bootstrap-icons';
import { Container, Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { CanCreateTeams } from '../../api/team/CanCreateTeamCollection';
import { COMPONENT_IDS } from '../testIDs/componentIDs';
import { footer } from '../styles';
// import { MinorParticipants } from '../../api/user/MinorParticipantCollection';

/**
 * The NavBar appears at the top of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
const NavBar = () => {

// useTracker connects Meteor data to React components.
  const { ready, currentUser, isCompliant, isAdmin, isParticipant, numTeams, numParticipants, teamCount, suggestionCount }
      = useTracker(() => {
    // Get access to collections
    const sub1 = CanCreateTeams.subscribe();
    const sub2 = Participants.subscribe();
    const sub3 = Teams.subscribe();
    const sub4 = Suggestions.subscribe();
    const rdy = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready();

    // Parse collections
    const curUser = Meteor.user() ? Meteor.user().username : '';
    let isCompl = CanCreateTeams.findOne().canCreateTeams;
    const isAdm = curUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParti = curUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    if (isParti) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompl = isCompl && participant.isCompliant;
    }
    const numParti = Participants.count();
    const numTms = Teams.find({ open: true }).count();
    const teamCnt = Teams.count();
    const suggestionCnt = Suggestions.count();
    return {
      ready: rdy,
      currentUser: curUser,
      isCompliant: isCompl,
      isAdmin: isAdm,
      isParticipant: isParti,
      numTeams: numTms,
      numParticipants: numParti,
      teamCount: teamCnt,
      suggestionCount: suggestionCnt,
    };
  }, []);

  return (ready ? (
      <Navbar expand="lg" style={footer} className="navbar-expand-lg">
        <Container fluid>
          <Navbar.Brand as={NavLink} to={ROUTES.LANDING}>
            <h1>HACC-Hui</h1>
          </Navbar.Brand>
          <Navbar.Toggle id='button.navbar-toggler' aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
            <Nav>
              {isParticipant ? (
                  [
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.YOUR_PROFILE}
                              key='edit-profile'>Profile</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              disabled={!isCompliant}
                              to={ROUTES.CREATE_TEAM}
                              key='team-creation'>Create Team</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.BEST_FIT}
                              key='list-teams'>Open Teams ({numTeams})</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.YOUR_TEAMS}
                              key='your-teams'>Your
                      Teams</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.LIST_PARTICIPANTS}
                              key='list-participants'>List Participants ({numParticipants})</Nav.Link>,
                    <Nav.Link id={COMPONENT_IDS.SUGGEST_TOOL_SKILL_BUTTON}
                              as={NavLink}
                              activeClassName="active"
                              to={ROUTES.SUGGEST_TOOL_SKILL}
                              key='suggest-tool-skill'>Suggest Tool/Skill</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.TEAM_INVITATIONS} key='team-invitations'>Invitations</Nav.Link>,
                  ]
              ) : ''}
              {isAdmin ? (
                  [
                    <Nav.Link id={COMPONENT_IDS.CONFIGURE_HACC}
                              as={NavLink}
                              activeClassName="active"
                              to={ROUTES.CONFIGURE_HACC}
                              key={ROUTES.CONFIGURE_HACC}>Configure HACC</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.UPDATE_MP}
                              key={ROUTES.UPDATE_MP}>Update Minor Participants Status</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.LIST_SUGGESTIONS}
                              key={ROUTES.LIST_SUGGESTIONS}>Suggestions List ({suggestionCount})</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.LIST_PARTICIPANTS_ADMIN}
                              key='list-participants-admin'>List Participants ({numParticipants})</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.VIEW_TEAMS}
                              key={ROUTES.VIEW_TEAMS}>View Teams ({teamCount})</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.ALL_TEAM_INVITATIONS}
                              key={ROUTES.ALL_TEAM_INVITATIONS}>View All Team Invitations</Nav.Link>,
                    <Nav.Link as={NavLink}
                              activeClassName="active"
                              to={ROUTES.DUMP_DATABASE}
                              key={ROUTES.DUMP_DATABASE}>Dump Database</Nav.Link>,
                  ]
              ) : ''}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link
                  as={NavLink}
                  id={COMPONENT_IDS.HELP_BUTTON}
                  activeClassName="active"
                  to={ROUTES.HELP_PAGE}
                  key={ROUTES.HELP_PAGE}>Help</Nav.Link>
              {currentUser === '' ? (
                  <NavDropdown id={COMPONENT_IDS.LOGIN_DROPDOWN} title="Login">
                    <NavDropdown.Item
                        id={COMPONENT_IDS.LOGIN_DROPDOWN_SIGN_IN}
                        as={NavLink}
                        to={ROUTES.SIGN_IN} key={ROUTES.SIGN_IN}>
                      <PersonFill/> Sign In
                    </NavDropdown.Item>
                  </NavDropdown>
              ) : (
                  <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser}>
                    <NavDropdown.Item
                        id={COMPONENT_IDS.NAVBAR_SIGN_OUT}
                        as={NavLink}
                        to={ROUTES.SIGN_OUT} key={ROUTES.SIGN_OUT}>
                      <BoxArrowRight/> Sign Out
                    </NavDropdown.Item>
                    {isParticipant ? (
                        <NavDropdown.Item as={NavLink}
                                          to={ROUTES.DELETE_ACCOUNT}>
                          <PersonFillX/> Delete Account
                        </NavDropdown.Item>) : ''}
                  </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  ) : <Spinner/>);
};

export default NavBar;
