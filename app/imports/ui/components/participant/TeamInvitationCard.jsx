import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Button,
  Col,
  Container,
  Row,
  Card,
} from 'react-bootstrap';
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const TeamInvitationCard = ({ teams, skills, tools, challenges, participants }) => {

  const [modalShow, setModalShow] = useState(false);

  const removeClick = (tID) => {
    const thisTeamID = tID;
    const collectionName2 = TeamInvitations.getCollectionName();
    const intID = TeamInvitations.findDoc({
      teamID: thisTeamID, participantID: Participants.findDoc({ userID: Meteor.userId() })._id });
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Removed Team Invitation', 'success');
      }
    });
  };

  const acceptClick = (tID) => {
    const thisTeam = tID;
    const devID = Participants.findDoc({ userID: Meteor.userId() })._id;
    const definitionData = { team: thisTeam, participant: devID };
    const collectionName = TeamParticipants.getCollectionName();
    if (TeamParticipants.find({ teamID: thisTeam, participantID: devID }).fetch().length === 0) {
      defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
          (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Team Invitation Accepted', 'success');
            }
          });
    }
    const collectionName2 = TeamInvitations.getCollectionName();
    const intID = TeamInvitations.findDoc({
      teamID: thisTeam,
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id });
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        console.error('Failed to remove', error);
      }
    });
  };

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  function TeamInvitationModal(props) {
    return (
      <Modal {...props} className='modal-xl modal-dialog-scrollable'>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>{teams.name}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row>
              <h3>Description</h3>
              <p>
                {teams.description}
              </p>
            </Row>
            <Row>
              <Col>
                <h3>Challenges</h3>
                {challenges.map((challenge) => <p key={challenge}>
                  {challenge}</p>)}
              </Col>
              <Col>
                <h3>Skills</h3>
                {skills.map((skill) => <p key={skill}>
                  {skill}</p>)}
              </Col>
              <Col>
                <h3>Tools</h3>
                {tools.map((tool) => <p key={tool}>
                  {tool}</p>)}
              </Col>
              <Col>
                <h3>Members</h3>
                {participants.map((participant) => <p key={participant}>
                  {participant.firstName} {participant.lastName}</p>)}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button id={teams._id} style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}
                  onClick={(() => acceptClick(teams._id))}>
            <HandThumbsUp size={22}/>
            {' Accept Request'}
          </Button>
          {/* eslint-disable-next-line max-len */}
          <Button id={teams._id} style={{ backgroundColor: 'rgb(245, 82, 82)', color: 'white' }}
                  onClick={(() => removeClick(teams._id))}>
            {'Decline Request '}
            <HandThumbsDown size={22}/>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      <Card
        align='center'
        onClick={() => setModalShow(true)}
        onMouseEnter={changeBackground}
        onMouseLeave={onLeave}>
        <Card.Header>
          <Row>
            <Image src={teams.image} rounded size='small'/>
            <h1>
              {teams.name}
            </h1>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
              <h4>Challenges</h4>
              {challenges.slice(0, 3).map((challenge) => <p
                style={{ color: 'rgb(89, 119, 199)' }}
                key={challenge}>
                {challenge}</p>)}
            </Col>
            <Col>
              <h4>Skills</h4>
              {skills.slice(0, 3).map((skill) => <p key={skill}>
                {skill}</p>)}
            </Col>
            <Col>
              <h4>Tools</h4>
              {tools.slice(0, 3).map((tool) => <p key={tool}>
                {tool}</p>)}
            </Col>
            <Col>
              <h4>Members</h4>
              {participants.map((participant) => <p key={participant}>
                {participant.firstName} {participant.lastName}</p>)}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Button id={teams._id} style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}
                  onClick={(() => acceptClick(teams._id))}>
            <HandThumbsUp size={22}/>
            {' Accept Request'}
          </Button>
          <Button id={teams._id} style={{ backgroundColor: 'rgb(245, 82, 82)', color: 'white' }}
                  onClick={(() => removeClick(teams._id))}>
            {'Decline Request '}
            <HandThumbsDown size={22}/>
          </Button>
        </Card.Footer>
      </Card>
      <TeamInvitationModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

TeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default TeamInvitationCard;
