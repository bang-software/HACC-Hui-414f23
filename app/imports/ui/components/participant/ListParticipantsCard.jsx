import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Col, Row, Card, Modal, Dropdown } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import * as Icon from 'react-bootstrap-icons';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const ListParticipantsCard = ({ participants, challenges, skills, tools, participantID }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const setOptions = () => {
    const teams = Teams.find({ owner: Participants.findDoc({ userID: Meteor.userId() })._id }).fetch();
    const newOptions = [];
    newOptions.push({ key: 'Select a Team', text: 'Select a Team', value: 'Select a Team' });
    for (let i = 0; i < teams.length; i++) {
      newOptions.push({ key: teams[i].name, text: teams[i].name, value: teams[i].name });
    }
    return newOptions;
  };

  const options = setOptions();

  const hasTeams = () => {
    const teams = Teams.find({ owner: Participants.findDoc({ userID: Meteor.userId() })._id }).fetch();
    if (teams.length === 0) {
      return false;
    }
    return true;
  };

  const handleChange = (dID, { val }, e) => {
    if (e.value !== 'Select a Team') {
      const thisTeam = Teams.findDoc({ name: e.value })._id;
      const thisparticipantID = Participants.findDoc({ _id: dID }).username;
      const definitionData = { team: thisTeam, participant: thisparticipantID };
      const collectionName = TeamInvitations.getCollectionName();
      if (typeof TeamParticipants.findOne({
        teamID: thisTeam,
        participantID: dID,
      }) !== 'undefined') {
        swal('Error',
            `Sorry, participant ${thisparticipantID} is already in this team!`,
            'error');
        return;
      }
      if (typeof TeamInvitations.findOne({
        teamID: thisTeam,
        participantID: dID,
      }) !== 'undefined') {
        swal('Error',
            `Sorry, participant ${thisparticipantID} has already been sent an invitation!`,
            'error');
        return;
      }
      defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
          (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Invitation sent successfully', 'success');
            }
          });
    }
  };

  return (
      <div>
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave} onClick={handleShow}
              style={{ padding: '0rem 1.5rem 0.5rem 1.5rem', border: 'none' }}>
          <Card.Body>
            <Card.Title>
              <h4 style={{ color: '#263763', paddingTop: '1.5rem' }}>
                <Icon.PersonFill size={30}/>
                {participants.firstName} {participants.lastName}
              </h4>
            </Card.Title>
            <Col>
              <h5>About Me</h5>
              {participants.aboutMe}
            </Col>
            <hr/>
            <Container>
              <Row>
                <Col>
                  <h5>Challenges</h5>
                  <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                    {challenges.slice(0, 3).map((challenge, i) => <p
                        style={{ color: 'rgb(89, 119, 199)' }}
                        key={challenge + i}>
                      {challenge}</p>)}
                  </Col>
                </Col>
                <Col>
                  <h5>Skills</h5>
                  {skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                    {skill.name}</p>)}
                </Col>
                <Col>
                  <h5>Tools</h5>
                  {tools.slice(0, 3).map((tool, i) => <p key={tool + i}>
                    {tool.name}</p>)}
                </Col>
                <Col>
                  <h5>Slack Username</h5>
                  {participants.slackUsername}
                </Col>
                <Col>
                  {hasTeams() ? (
                      <Dropdown onSelect={handleChange} className="button icon" style={{ backgroundColor: 'transparent' }}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Send Invitation
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {options.map((option, index) => (
                              <Dropdown.Item eventKey={option.value} key={index}>
                                {option.text}
                              </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                  ) : null}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {participants.firstName} {participants.lastName}
            <br/> {participants.demographicLevel}
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col><Icon.Github/>GitHub:<br/>
                  <a href={participants.gitHub}>{participants.gitHub}</a>
                </Col>
                <Col><Icon.Server/>Website:<br/>
                  <a href={participants.website}>{participants.website}</a>
                </Col>
                <Col><Icon.Linkedin/>LinkedIn:<br/>
                  <a href={participants.linkedIn}>{participants.linkedIn}</a>
                </Col>
                <Col><Icon.Slack/>Slack Username:<br/>
                  <a href={participants.slackUsername}>{participants.slackUsername}</a>
                </Col>
              </Row>
            </Container>
            <hr/>
            <Col>
              <h6>Challenges</h6>
              <ul>
                {challenges.map((challenge, i) => (
                    <li key={challenge + i}>{challenge}</li>
                ))}
              </ul>
            </Col>
            <hr/>
            <Col>
              <h6>Skills</h6>
              <ul>
                {skills.map((skill, i) => <li key={skill + i}>{skill.name}</li>)}
              </ul>
            </Col>
            <hr/>
            <Col>
              <h6>Tools</h6>
              <ul>
                {tools.map((tool, i) => <li key={tool + i}>{tool.name}</li>)}
              </ul>
            </Col>
            <hr/>
            {hasTeams() ? (
                <Dropdown
                    onSelect={handleChange.bind(this, participantID)} className="button icon" style={{ backgroundColor: 'transparent' }}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Send Invitation
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {options.map((option, index) => (
                        <Dropdown.Item eventKey={option.value} key={index}>
                          {option.text}
                        </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
            ) : null}
          </Modal.Body>
        </Modal>
      </div>
  );
};

ListParticipantsCard.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.object.isRequired,
};
export default withTracker(() => ({
  teamInvitation: TeamInvitations.find({}).fetch(),
}))(ListParticipantsCard);
