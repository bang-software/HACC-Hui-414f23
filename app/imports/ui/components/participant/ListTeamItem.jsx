import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';

const ListTeamItem = ({ team }) => {
  const {
    ready,
    participant,
    requested,
    isAMember,
    collectionName,
    teamChallenges,
    teamSkills,
    teamTools,
    teamMembers } = useTracker(() => {
    const sub1 = Participants.subscribe();
    const sub2 = WantsToJoin.subscribe();
    const sub3 = TeamChallenges.subscribe();
    const sub4 = TeamSkills.subscribe();
    const sub5 = TeamTools.subscribe();
    const sub6 = TeamParticipants.subscribe();
    const sub7 = Challenges.subscribe();
    const sub8 = Skills.subscribe();
    const sub9 = Tools.subscribe();

    const teamID = team._id;
    const teamChallenges2 = TeamChallenges.find({ teamID }).fetch().map((tc) => Challenges.findDoc(tc.challengeID).title);
    const teamSkills2 = TeamSkills.find({ teamID }).fetch().map((ts) => Skills.findDoc(ts.skillID).name);
    const teamTools2 = TeamTools.find({ teamID }).fetch().map((tt) => Tools.findDoc(tt.toolID).name);
    const teamMembers2 = TeamParticipants.find({ teamID }).fetch().map((tp) => Participants.getFullName(tp.participantID));

    const participant2 = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant2._id);
    const collectionName2 = WantsToJoin.getCollectionName();
    const isAMember2 = teamMembers2.includes(participantName);
    const joinRequests = WantsToJoin.find({ teamID: team._id }).fetch();
    const joinSentUsers = joinRequests.map((jr) => jr.participantID);

    const requested2 = joinSentUsers.includes(participant2._id);
    const rdy =
      sub1.ready() &&
      sub2.ready() &&
      sub3.ready() &&
      sub4.ready() &&
      sub5.ready() &&
      sub6.ready() &&
      sub7.ready() &&
      sub8.ready() &&
      sub9.ready();
    return {
      ready: rdy,
      participant: participant2,
      requested: requested2,
      isAMember: isAMember2,
      collectionName: collectionName2,
      teamChallenges: teamChallenges2,
      teamSkills: teamSkills2,
      teamTools: teamTools2,
      teamMembers: teamMembers2,
    };
  }, []);

  const handleClick = () => {

    const teamName = team._id;
    const participantUsername = participant._id;
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
        <h1 style={{ textAlign: 'center' }}>{team.name}</h1>
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

ListTeamItem.propTypes = {
  team: PropTypes.object.isRequired,
};
export default ListTeamItem;
