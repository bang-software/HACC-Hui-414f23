import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { HACCHui } from '../../api/hacc-hui/HACCHui';
import { COMPONENT_IDS } from '../testIDs/componentIDs';

const SideBar = ({ children }) => {
  const [visible, setVisible] = useState(false);
  let currentUser = '';
  let isParticipant = false;
  let isAdmin = false;
  const { isCompliant, numParticipants, numTeams, teamCount, suggestionCount, uncompliantMinors } =
    useTracker(() => {
    currentUser = Meteor.user() ? Meteor.user().username : '';
    isAdmin = currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    isParticipant = currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    let compliant = HACCHui.canCreateTeams;

    if (isParticipant) {
      const participant = Participants.findOne({ userID: Meteor.userId() });
      compliant = compliant && participant.isCompliant;
    }

    return {
      currentUser: Meteor.user() ? Meteor.user().username : '',
      isCompliant: compliant,
      numParticipants: Participants.find().count(),
      numTeams: Teams.find({ open: true }).count(),
      teamCount: Teams.find().count(),
      suggestionCount: Suggestions.find().count(),
      uncompliantMinors:
      MinorParticipants.find({}).fetch().filter(m => !Participants.findOne(m.participantID).isCompliant).length,
    };
  });
  // TODO: Fix styling of sidebar to keep consistency
  return (
  <Container fluid>
      <Navbar fixed={'top'} expand={false} className={'mobileBar'} style={{ color: 'white' }}>
        <Navbar.Toggle id={COMPONENT_IDS.SIDEBAR_TOGGLE} aria-controls="offcanvasNavbar" onClick={() => setVisible(!visible)}/>
        <Navbar.Brand href="#" style={{ color: 'white' }}>HACC-Hui</Navbar.Brand>
      </Navbar>
      <Offcanvas show={visible} onHide={() => setVisible(false)} placement="start">
        <Offcanvas.Header>
          <Offcanvas.Title>Menu</Offcanvas.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setVisible(false)}
            id={COMPONENT_IDS.SIDEBAR_CLOSE_BUTTON}
          />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav id={COMPONENT_IDS.SIDEBAR} className="flex-column">
            {isParticipant && (
              <>
                {isCompliant && <Nav.Link as={NavLink} to={ROUTES.CREATE_TEAM}>Create a Team</Nav.Link>}
                <Nav.Link as={NavLink} id={COMPONENT_IDS.SIDEBAR_PROFILE} to={ROUTES.YOUR_PROFILE}>Your Profile</Nav.Link>
                <Nav.Link as={NavLink} to={ROUTES.BEST_FIT}>List the Teams ({numTeams})</Nav.Link>
                {isCompliant && <Nav.Link id={COMPONENT_IDS.SIDEBAR_YOUR_TEAMS_BUTTON}
                  as={NavLink} to={ROUTES.YOUR_TEAMS}>Your Teams</Nav.Link>}
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS}
                          as={NavLink} to={ROUTES.LIST_PARTICIPANTS}>List the Participants ({numParticipants})</Nav.Link>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_SUGGEST_TOOL_SKILL_BUTTON}
                          as={NavLink} to={ROUTES.SUGGEST_TOOL_SKILL}>Suggest Tool/Skill</Nav.Link>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_TEAM_INVITATIONS_BUTTON}
                          as={NavLink} to={ROUTES.TEAM_INVITATIONS}>Your Invitations</Nav.Link>
              </>
            )}
            {isAdmin && (
              <>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_CONFIGURE_HACC}
                          as={NavLink} to={ROUTES.CONFIGURE_HACC}>Configure HACC</Nav.Link>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_UPDATE_MP}
                          as={NavLink} to={ROUTES.UPDATE_MP}>Update Minor Participants Status ({uncompliantMinors})</Nav.Link>
                <Nav.Link as={NavLink} to={ROUTES.LIST_SUGGESTIONS}>Suggestions List ({suggestionCount})</Nav.Link>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_LIST_PARTICIPANTS_ADMIN}
                          as={NavLink}
                          to={ROUTES.LIST_PARTICIPANTS_ADMIN}
                          key='list-participants-admin'>List Participants ({numParticipants})</Nav.Link>
                <Nav.Link id={COMPONENT_IDS.SIDEBAR_VIEW_TEAMS_BUTTON}
                          as={NavLink} to={ROUTES.VIEW_TEAMS}>View Team ({teamCount})</Nav.Link>
                <Nav.Link id = {COMPONENT_IDS.SIDEBAR_ALL_TEAM_INVITATIONS_NAV}
                          as={NavLink}
                          to={ROUTES.ALL_TEAM_INVITATIONS}
                          key={ROUTES.ALL_TEAM_INVITATIONS}>View All Team Invitations</Nav.Link>
                <Nav.Link as={NavLink} to={ROUTES.DUMP_DATABASE}>Dump Database</Nav.Link>
              </>
            )}
            {currentUser ? (
              <>
                <Nav.Link as={NavLink} to={ROUTES.SIGN_OUT}>Sign Out</Nav.Link>
                <Nav.Link as={NavLink} to={ROUTES.DELETE_ACCOUNT}>Delete Account</Nav.Link>
              </>
            ) : (
              <Nav.Link as={NavLink} id={COMPONENT_IDS.SIDEBAR_SIGN_IN} to={ROUTES.SIGN_IN}>Sign In</Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      {children}
    </Container>
  );
};

SideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withRouter(SideBar);
