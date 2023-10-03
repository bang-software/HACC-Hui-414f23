import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { EmojiFrown } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import TeamInvitationCard from './TeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { paleBlueStyle } from '../../styles';

const TeamInvitationsWidget = () => {

  // useTracker connects Meteor data to React components.
  const {
    allTeamChallenges,
    teamInvitations,
    allTeamSkills,
    allTeamTools,
    allTeams,
    allSkills,
    allChallenges,
    allTools,
    allParticipants,
    allTeamParticipants,
    ready,
  } = useTracker(() => {
    // Get access to collections
    const sub1 = TeamChallenges.subscribe();
    const sub2 = TeamInvitations.subscribe();
    const sub3 = TeamSkills.subscribe();
    const sub4 = TeamTools.subscribe();
    const sub5 = Teams.subscribe();
    const sub6 = Skills.subscribe();
    const sub7 = Challenges.subscribe();
    const sub8 = Tools.subscribe();
    const sub9 = Participants.subscribe();
    const sub10 = TeamParticipants.subscribe();
    const ready2 = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready()
      && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready() && sub10.ready();
    const allTeamChallenges2 = TeamChallenges.find({}).fetch();
    const teamInvitations2 = TeamInvitations.find({
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id }).fetch();
    const allTeamSkills2 = TeamSkills.find({}).fetch();
    const allTeamTools2 = TeamTools.find({}).fetch();
    const allTeams2 = Teams.find({}).fetch();
    const allSkills2 = Skills.find({}).fetch();
    const allChallenges2 = Challenges.find({}).fetch();
    const allTools2 = Tools.find({}).fetch();
    const allParticipants2 = Participants.find({}).fetch();
    const allTeamParticipants2 = TeamParticipants.find({}).fetch();

    return {
      allTeamChallenges: allTeamChallenges2,
      teamInvitations: teamInvitations2,
      allTeamSkills: allTeamSkills2,
      allTeamTools: allTeamTools2,
      allTeams: allTeams2,
      allSkills: allSkills2,
      allChallenges: allChallenges2,
      allTools: allTools2,
      allParticipants: allParticipants2,
      allTeamParticipants: allTeamParticipants2,
      ready: ready2,
    };
  });

  function getTeamInvitations(invs) {
    const data = [];
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < allTeams.length; j++) {
        if (invs[i].teamID === allTeams[j]._id) {
          data.push(allTeams[j]);
        }
      }
    }
    return data;
  }
  function getTeamSkills(teamID) {
    const data = [];
    const skills = allTeamSkills.filter(skill => skill.teamID === teamID);
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < allSkills.length; j++) {
        if (skills[i].skillID === allSkills[j]._id) {
          data.push(allSkills[j].name);
        }
      }
    }
    return data;
  }
  function getTeamTools(teamID) {
    const data = [];
    const tools = allTeamTools.filter(tool => tool.teamID === teamID);
    for (let i = 0; i < tools.length; i++) {
      for (let j = 0; j < allTools.length; j++) {
        if (tools[i].toolID === allTools[j]._id) {
          data.push(allTools[j].name);
        }
      }
    }
    return data;
  }
  function getTeamChallenges(teamID) {
    const data = [];
    const challenges = allTeamChallenges.filter(challenge => challenge.teamID === teamID);
    for (let i = 0; i < challenges.length; i++) {
      for (let j = 0; j < allChallenges.length; j++) {
        if (challenges[i].challengeID === allChallenges[j]._id) {
          data.push(allChallenges[j].title);
        }
      }
    }
    return data;
  }

  function getTeamDevelopers(teamID) {
    const data = [];
    const participants = allTeamParticipants.filter(participant => participant.teamID === teamID);
    for (let i = 0; i < participants.length; i++) {
      for (let j = 0; j < allParticipants.length; j++) {
        if (participants[i].participantID === allParticipants[j]._id) {
          data.push({
            firstName: allParticipants[j].firstName,
            lastName: allParticipants[j].lastName,
          });
        }
      }
    }
    return data;
  }
  const returnValue = (teamInvitations.length === 0) ? (
      <Container align='center' style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Row style={{ paddingTop: '3rem 0' }}>
          <EmojiFrown size={100} style={{ paddingTop: '3rem 0' }}/>
        </Row>
        <Row>
          <h2>You have no invitations at the moment.</h2>
        </Row>
        <Row>
          <h4>Please check back later.</h4>
        </Row>
      </Container>
  ) : (
    <div style={{ paddingBottom: '50px', paddingTop: '40px',
    }}>
      <Container style={{ display: 'block',
        marginLeft: 'auto', marginRight: 'auto' }}>
        <Container style = {paleBlueStyle} >
          <Row>
            <h2 style={{ paddingBottom: '1rem', textAlign: 'center' }}>
              Team Invitations
            </h2>
          </Row>
          <Col width={15}>
            <Card>
              {/* eslint-disable-next-line max-len */}
              {getTeamInvitations(teamInvitations).map((team) => <TeamInvitationCard
                key={team._id}
                teams={team}
                skills={getTeamSkills(team._id)}
                tools={getTeamTools(team._id)}
                challenges={getTeamChallenges(team._id)}
                participants={getTeamDevelopers(team._id)}
              />)}
            </Card>
          </Col>
        </Container>
      </Container>
    </div>
  );
  return (ready ? returnValue : <Spinner/>);
};

export default TeamInvitationsWidget;
