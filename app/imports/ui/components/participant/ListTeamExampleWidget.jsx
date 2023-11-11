import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const ListTeamExampleWidget = ({ team, teamChallenges, teamSkills, teamTools, teamMembers }) => {

  const { ready, participant, requested, isAMember, collectionName } = useTracker(() => {
    const sub1 = Participants.subscribe();
    const sub2 = WantsToJoin.subscribe();
    const participant2 = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant2._id);
    const collectionName2 = WantsToJoin.getCollectionName();
    const isAMember2 = teamMembers.includes(participantName);
    const joinRequests = WantsToJoin.find({ teamID: team._id }).fetch();
    const joinSentUsers = joinRequests.map((jr) => jr.participantID);
    const requested2 = joinSentUsers.includes(participant2._id);
    const rdy = sub1.ready() && sub2.ready();
    return {
      ready: rdy,
      participant: participant2,
      requested: requested2,
      isAMember: isAMember2,
      collectionName: collectionName2,
    };
  }, []);

  const handleClick = () => {

    const teamName = team.name;
    const participantUsername = participant.username;
    const definitionData = {
      team: teamName,
      participant: participantUsername,
    };

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Sent Request Fail', error, 'error');
      } else {

        swal('Success', 'Join Request Sent', 'success');
      }
    });
  };

  const renderButton = () => {

    if (isAMember) {
      return (<Button id={team._id}
                      disabled={true} style={{ width: `${100}px`, textAlign: 'center' }} >You are a member of this team</Button>);
    }
    if (requested) {
      return (<Button id={team._id}
                      disabled={true} style={{ width: `${100}px`, textAlign: 'center' }} >You sent the request</Button>);
    }
    return (<Button id={team._id}
                    onClick={handleClick} style={{ width: `${100}px`, textAlign: 'center' }} >Request to Join</Button>);
  };

  return (ready ? (
    <Card>
      <Card.Header>
        <h2 style={{ textAlign: 'center' }}>{team.name}</h2>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>Challenges</h4>
              </Card.Header>
              <ListGroup>
                {teamChallenges.map((c) => <ListGroup.Item key={c}>{c}</ListGroup.Item>)}
              </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <h4>Desired Skills</h4>
              </Card.Header>
              <ListGroup>
                {teamSkills.map((s) => <ListGroup.Item key={s}>{s}</ListGroup.Item>)}
              </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <h4>Desired Tools</h4>
              </Card.Header>
            <ListGroup>
              {teamTools.map((t) => <ListGroup.Item key={t}>{t}</ListGroup.Item>)}
            </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <h4>Devpost/Github</h4>
              </Card.Header>
              <ListGroup>
                <ListGroup.Item>
                  <a href={team.devPostPage}>Devpost Page</a> <br />
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href={team.gitHubRepo}>GitHub repo</a>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                <h4>Members</h4>
              </Card.Header>
              <ListGroup>
                {teamMembers.map((t) => <ListGroup.Item key={t}>{t}</ListGroup.Item>)}
              </ListGroup>
            </Card>
          </Col>
          <Col style={{ textAlign: 'center' }}>
            {renderButton()}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : <Spinner/>);
};

ListTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamSkills: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamTools: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamMembers: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
};
export default ListTeamExampleWidget;
