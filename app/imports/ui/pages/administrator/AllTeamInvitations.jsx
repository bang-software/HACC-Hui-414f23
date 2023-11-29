import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import AllTeamInvitationCard from '../../components/administrator/AllTeamInvitationCard';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';

const AllTeamInvitations = () => {
  const {
    teamChallenges,
    teamInvitations,
    teamSkills,
    teamTools,
    teams,
    skills,
    challenges,
    tools,
    participants,
    teamParticipants,
  } = useTracker(() => ({
    teamChallenges: TeamChallenges.find({}).fetch(),
    teamInvitations: TeamInvitations.find().fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    participants: Participants.find({}).fetch(),
    teamParticipants: TeamParticipants.find({}).fetch(),
  }));

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
      // eslint-disable-next-line no-unused-vars
  const sortBy = [
        { key: 'teams', text: 'teams', value: 'teams' },
        { key: 'challenges', text: 'challenges', value: 'challenges' },
        { key: 'skills', text: 'skills', value: 'skills' },
        { key: 'tools', text: 'tools', value: 'tools' },
      ];

  const universalTeams = teams;

  function sortedUniq(arr) {
    return Array.from(new Set(arr)).sort();
  }

  function getTeamInvitations(invs) {
    const data = [];
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (invs[i].teamID === universalTeams[j]._id) {
          data.push(universalTeams[j]);
        }
      }
    }
    return sortedUniq(data);
  }

  const universalSkills = skills;

  function getTeamSkills(teamID, teamSkillsGTS) {
    const data = [];
    // const skills = _.filter(teamSkills, { teamID: teamID });
    const skillsGTS = teamSkillsGTS.filter(skill => skill.teamID === teamID);
    for (let i = 0; i < skillsGTS.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skillsGTS[i].skillID === universalSkills[j]._id) {
          data.push(universalSkills[j].name);
        }
      }
    }
    return data;
  }

  const universalTools = tools;

  function getTeamTools(teamID, teamToolsGTT) {
    const data = [];
    // const tools = _.filter(teamTools, { teamID: teamID });
    const toolsGTT = teamToolsGTT.filter(tool => tool.teamID === teamID);
    for (let i = 0; i < toolsGTT.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (toolsGTT[i].toolID === universalTools[j]._id) {
          data.push(universalTools[j].name);
        }
      }
    }
    return data;
  }

  const universalChallenges = challenges;

  function getTeamChallenges(teamID, teamChallengesGTC) {
    const data = [];
    // const challenges = _.filter(teamChallenges, { teamID: teamID });
    const challengesGTC = teamChallengesGTC.filter(challenge => challenge.teamID === teamID);
    for (let i = 0; i < challengesGTC.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (challengesGTC[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  }

  const allDevelopers = participants;

  function getTeamDevelopers(teamID, teamParticipantsGTD) {
    const data = [];
    // const participants = _.filter(teamParticipants, { teamID: teamID });
    const participantsGTD = teamParticipantsGTD.filter(participant => participant.teamID === teamID);
    for (let i = 0; i < participantsGTD.length; i++) {
      for (let j = 0; j < allDevelopers.length; j++) {
        if (participantsGTD[i].participantID === allDevelopers[j]._id) {
          data.push({
            firstName: allDevelopers[j].firstName,
            lastName: allDevelopers[j].lastName,
          });
        }
      }
    }
    return data;
  }
  const noInvitations = () => (
      <div id={PAGE_IDS.ALL_TEAM_INVITATIONS} style={{ textAlign: 'center' }}>
        <h2>
          There are no active invitations at the moment.
        </h2>
      </div>
  );

  const invitationsList = () => (
      <Container id={PAGE_IDS.ALL_TEAM_INVITATIONS}>
        <Row style = {{ justifyContent: 'center' }}>
          <h2 style={{ paddingTop: '2rem' }}>
            Team Invitations
          </h2>
        </Row>
        <Col width={16}>
          <Card style={{ borderColor: 'transparent' }}>
            {getTeamInvitations(teamInvitations).map((teamsGTI) => <AllTeamInvitationCard
                key={teamsGTI._id}
                teams={teamsGTI}
                skills={getTeamSkills(teamsGTI._id, teamSkills)}
                tools={getTeamTools(teamsGTI._id, teamTools)}
                challenges={getTeamChallenges(teamsGTI._id, teamChallenges)}
                participants={getTeamDevelopers(teamsGTI._id, teamParticipants)}/>)}
          </Card>
        </Col>
      </Container>
  );
  return teamInvitations.length === 0 ? noInvitations() : invitationsList();
};

export default withAllSubscriptions(AllTeamInvitations);
