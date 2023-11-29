import { Meteor } from 'meteor/meteor';
import React from 'react';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';
import MemberTeamCard from './MemberTeamCard';
import { paleBlueStyle } from '../../styles';

// eslint-disable-next-line react/prop-types
const YourTeamsWidget = ({ participant, teams, memberTeams, participants, teamParticipants, teamInvitation }) => {

    const allParticipants = participants;
    const getTeamParticipants = (teamID, teamParticipantsGTP) => {
        const data = [];
        const participantsGTP = _.uniqBy(_.filter(teamParticipantsGTP, { teamID: teamID }), 'participantID');
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
// eslint-disable-next-line react/prop-types
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
// eslint-disable-next-line react/prop-types
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
          {/* eslint-disable-next-line react/prop-types */}
        {teams.length !== 0 && (
            <Row>
              <Col>
                <Card style={paleBlueStyle}>
                  <Card.Title><h4 className="card-header text-center">Owner</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                        {/* eslint-disable-next-line react/prop-types */}
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
          {/* eslint-disable-next-line react/prop-types */}
        {memberTeams.length !== 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Title><h4 className="card-header text-center">Member</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                        {/* eslint-disable-next-line react/prop-types */}
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

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const teams = Teams.find({ owner: participantID }).fetch();
  const memberTeams = _.map(_.uniqBy(TeamParticipants.find({ participantID }).fetch(), 'teamID'),
      (tp) => Teams.findDoc(tp.teamID));
  const participants = Participants.find({}).fetch();
  const teamParticipants = TeamParticipants.find({}).fetch();
  const teamInvitation = TeamInvitations.find({}).fetch();
  return {
    participant,
    teams,
    memberTeams,
    participants,
    teamParticipants,
    teamInvitation,
  };
})(YourTeamsWidget);
