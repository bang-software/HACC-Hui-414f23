import React, { useState } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Image,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const AllTeamInvitationCard = ({ teams, skills, tools, challenges, participants }) => {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    const changeBackground = (e) => {
      e.currentTarget.style.backgroundColor = '#d6d6d6';
      e.currentTarget.style.cursor = 'pointer';
    };

    const onLeave = (e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const teamID = Teams.findDoc({ name: teams.name })._id;
    const invitations = TeamInvitations.find({ teamID }).fetch();
    for (let i = 0; i < invitations.length; i++) {
      invitations[i] = invitations[i].participantID;
    }
    const invitedMembers = [];
    invitations.forEach((id) => {
      invitedMembers.push(Participants.getFullName(id));
    });
    return (
      <div id={COMPONENT_IDS.ALL_TEAM_INVITATIONS_CARD_ADMIN}>
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave}
              onClick={handleShow}
              style={{ padding: '0rem 2rem 1rem 2rem' }}>
            <Card.Body>
              <Card.Title>
                <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
                  <Icon.PeopleFill size={30} />
                  {teams.name}
                </h3>
              </Card.Title>
                <Container>
                  <Row columns={5}>
                    <Col>
                      <Image src={teams.image} rounded size='small'/>
                      <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                        {challenges.slice(0, 3).map((challenge, i) => <p
                            style={{ color: 'rgb(89, 119, 199)' }}
                            key={challenge + i}>
                          {challenge}</p>)}
                      </Col>
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Skills</h5>
                      {skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                        {skill}</p>)}
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Tools</h5>
                      {tools.slice(0, 3).map((tool) => <p key={tool}>
                        {tool}</p>)}
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Member(s) Invited:</h5>
                      {invitedMembers.slice(0, 3).map((members, i) => <p key={members + i}>
                        {members}</p>)}
                    </Col>
                  </Row>
                </Container>
            </Card.Body>
        </Card>
            <Modal show={show} onHide={handleClose}>
            <Modal.Title style = {{ padding: '1rem' }} >{teams.name}</Modal.Title>
            <Modal.Dialog>
              <Image size='medium' src={teams.image} />
              <Modal.Body>
                <h2>Description</h2>
                <p>
                  {teams.description}
                </p>
                <h2>Challenges</h2>
                {challenges.map((challenge, i) => <p key={challenge + i}>
                  {challenge}</p>)}
                <h2>Skills</h2>
                {skills.map((skill, i) => <p key={skill + i}>
                  {skill}</p>)}
                <h2>Tools</h2>
                {tools.map((tool, i) => <p key={tool + i}>
                  {tool}</p>)}
                <h2>Members</h2>
                {participants.map((participant, i) => <p key={participant + i}>
                  {participant.firstName} {participant.lastName}</p>)}
                <h2>Member(s) Invited:</h2>
                {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                  {members}</p>)}
              </Modal.Body>
            </Modal.Dialog>
            </Modal>
      </div>
    );
};

AllTeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default AllTeamInvitationCard;
