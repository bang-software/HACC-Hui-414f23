import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';
import MemberTeamCard from './MemberTeamCard';
import { paleBlueStyle } from '../../styles';

const YourTeamsWidget = () => {
  // lodash _uniqBy method
  const uniqBy = (arr, predicate) => {
    if (!Array.isArray(arr)) { return []; }

    const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

    const pickedObjects = arr.filter(item => item).reduce((map, item) => {
      const key = cb(item);
      if (!key) {
        return map;
      }
      return map.has(key) ? map : map.set(key, item);
      }, new Map()).values();

    return [...pickedObjects];
  };

  const { participant, teams, memberTeams, participants, teamParticipants, teamInvitation } = useTracker(() => {
    const part = Participants.findDoc({ userID: Meteor.userId() });
    const participantID = part._id;
    return {
      participant: part,
      teams: Teams.find({ owner: participantID }).fetch(),
      memberTeams: uniqBy(TeamParticipants.find({ participantID }).fetch(), 'teamID').map((tp) => Teams.findDoc(tp.teamID)),
      participants: Participants.find({}).fetch(),
      teamParticipants: TeamParticipants.find({}).fetch(),
      teamInvitation: TeamInvitations.find({}).fetch(),
    };
  }, []);

  const allParticipants = participants;
  const getTeamParticipants = (teamID, teamParticipantsGTP) => {
    const data = [];
    const filteredParticipants = teamParticipantsGTP.filter(p => p.teamID === teamID);
    const participantsGTP = uniqBy(filteredParticipants, 'participantID');
    for (let i = 0; i < participantsGTP.length; i++) {
      for (let j = 0; j < allParticipants.length; j++) {
        if (participantsGTP[i].participantID === allParticipants[j]._id) {
          data.push({
            firstName: allParticipants[j].firstName,
            lastName: allParticipants[j].lastName,
          });
        }
      }
    }
    return data;
  };

  if (!participant?.isCompliant) {
    return (
        <div className="text-center">
          <h2>
            <i className="fas fa-thumbs-down"></i>
            You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            &nbsp;or we haven&apos;t received the signed form yet.
          </h2>
          <p>You can&apos;t be the owner of a team until you do. Please check back later.</p>
        </div>
    );
  }

  if (teams.length + memberTeams.length === 0) {
    return (
        <div className="text-center">
          <h2>
            <i className="fas fa-users"></i>
            You are not the owner or member of any teams
          </h2>
          <p>Please check back later.</p>
        </div>
    );
  }

  return (
      <Container>
        <Row>
          <h2 className="text-center mb-3">Your Teams</h2>
        </Row>
        {teams.length !== 0 && (
            <Row>
              <Col>
                <Card style={paleBlueStyle}>
                  <Card.Title><h4 className="card-header text-center">Owner</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                      {teams.map(team => (
                          <ListGroup.Item key={team._id}>
                            <YourTeamsCard
                                key={team._id}
                                team={team}
                                teamParticipants={getTeamParticipants(team._id, teamParticipants)}
                                teamInvitation={teamInvitation}/>
                          </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        )}
        {memberTeams.length !== 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Title><h4 className="card-header text-center">Member</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                      {memberTeams.map(team => (
                          <ListGroup.Item key={team._id}>
                            <MemberTeamCard key={team._id}
                                            team={team}
                                            teamParticipants={getTeamParticipants(team._id, teamParticipants)}
                            />
                          </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        )}
      </Container>
  );
};

export default YourTeamsWidget;
