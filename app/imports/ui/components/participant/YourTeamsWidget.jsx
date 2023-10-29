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

  const data = useTracker(() => {
    const participant = Participants.findOne({ userID: Meteor.userId() });
    const participantID = participant?._id;
    const teams = Teams.find({ owner: participantID }).fetch();
    const teamParticipantsArray = TeamParticipants.find({ participantID }).fetch();
    const memberTeamsIDs = [...new Set(teamParticipantsArray.map(item => item.teamID))];
    const memberTeams = memberTeamsIDs.map(id => Teams.findOne(id));
    const allParticipants = Participants.find({}).fetch();
    const teamInvitations = TeamInvitations.find({}).fetch();

    return {
      participant,
      teams,
      memberTeams,
      allParticipants,
      teamParticipantsArray,
      teamInvitations,
    };
  });

  const getTeamParticipants = (teamID) => {
    const filteredParticipants = data.teamParticipantsArray.filter(tp => tp.teamID === teamID);
    return filteredParticipants.map(fp => {
      const participantDetail = data.allParticipants.find(p => p._id === fp.participantID);
      return {
        firstName: participantDetail.firstName,
        lastName: participantDetail.lastName,
      };
    });
  };

  if (!data.participant?.isCompliant) {
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

  if (data.teams.length + data.memberTeams.length === 0) {
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
        {data.teams.length !== 0 && (
            <Row>
              <Col>
                <Card style={paleBlueStyle}>
                  <Card.Title><h4 className="card-header text-center">Owner</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                      {data.teams.map(team => (
                          <ListGroup.Item key={team._id}>
                            <YourTeamsCard
                                key={team._id}
                                teams={team}
                                teamParticipants={getTeamParticipants(team._id)}
                                teamInvitation={data.teamInvitations}/>
                          </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        )}
        {data.memberTeams.length !== 0 && (
            <Row>
              <Col>
                <Card>
                  <Card.Title><h4 className="card-header text-center">Member</h4></Card.Title>
                  <Card.Body>
                    <ListGroup>
                      {data.memberTeams.map(team => (
                          <ListGroup.Item key={team._id}>
                            <MemberTeamCard key={team._id} team={team} teamParticipants={getTeamParticipants(team._id)}/>
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
