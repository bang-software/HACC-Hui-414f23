import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Modal, ListGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const ViewTeam = ({ team, teamMembers, isCompliant }) => {
  const { participants: fetchedParticipants, teamChallenges: fetchedteamChallenges } = useTracker(() => {
    const participants = Participants.find({}).fetch();
    const teamChallenges = TeamChallenges.find({ teamID: team._id }).fetch().map(tc => Challenges.findDoc(tc.challengeID));
    return { participants, teamChallenges };
  }, [team._id]);

  const [showModal, setShowModal] = useState(false);

  const captain = fetchedParticipants.find(p => team.owner === p._id);
  const challenge = fetchedteamChallenges[0];

  return (
    <>
      <Card id={COMPONENT_IDS.VIEW_TEAM_CARD}
            style={{ padding: '1.0rem 1.5rem', cursor: 'pointer' }} onClick={() => setShowModal(true)}>
        <Card.Body>
          <Card.Title>
            {team.name} {isCompliant ? '✅' : '⚠️'}
          </Card.Title>
          <Card.Text>
            <strong>Captain:</strong> {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}` : 'None'},
            <strong>Challenge:</strong> {challenge ? challenge.title : 'None yet'}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{team.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4}>
                <h5>Challenges</h5>
                <ListGroup>
                  {fetchedteamChallenges.map(c => <ListGroup.Item key={c._id}>{c.title}</ListGroup.Item>)}
                </ListGroup>
                <h5>Captain</h5>
                {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}` : 'None'}
              </Col>
              <Col xs={5}>
                <h5>Members</h5>
                <ListGroup variant="flush">
                  {teamMembers.map(t => <ListGroup.Item key={t}>{t}</ListGroup.Item>)}
                </ListGroup>
              </Col>
              <Col xs={5}>
                <h5>{isCompliant ? 'Team is Compliant' : 'Team is not Compliant'}</h5>
                <p>Devpost Page: {team.devPostPage}</p>
                <p>Github Repo: {team.gitHubRepo}</p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button id={COMPONENT_IDS.EDIT_TEAM_BUTTON_ADMIN} as={Link} to={`/admin-edit-team/${team._id}`} variant="secondary">
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ViewTeam.propTypes = {
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  isCompliant: PropTypes.bool.isRequired,
};

export default ViewTeam;
