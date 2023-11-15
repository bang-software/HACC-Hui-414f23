import React from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PeopleFill } from 'react-bootstrap-icons';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import InterestedParticipantCard from './InterestedParticipantCard';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const NoInterestedPart = () => (
    <Container id={PAGE_IDS.INTERESTED_PARTICIPANTS}>
      <Row>
        <PeopleFill size={96}/>
      </Row>
      <Row>
        <h3 className="fw-bold text-center">There are no interested partcipants at the moment.</h3>
      </Row>
      <Row>
        <h4 className="text-center"> Please check back later.</h4>
      </Row>
    </Container>
);

/**
 * Renders the interested participants
 * @memberOf ui/pages
 */
const InterestedParticipants = () => {
  // eslint-disable-next-line no-undef
  let url = window.location.href;
  url = url.split('/');
  const documentId = url[url.length - 1];
  const { developers, developerChallenges, developerSkills, developerTools, interestedDevs, teams, skills, challenges, tools }
      = useTracker(() => {
    const devs = Participants.find({}).fetch();
    const devChallenges = ParticipantChallenges.find({}).fetch();
    const devSkills = ParticipantSkills.find({}).fetch();
    const devTools = ParticipantTools.find({}).fetch();
    const interestedDevelopers = WantsToJoin.find({ teamID: documentId }).fetch();
    const findTeams = Teams.find({ _id: documentId }).fetch();
    const findSkills = Skills.find({}).fetch();
    const findChallenges = Challenges.find({}).fetch();
    const findTools = Tools.find({}).fetch();

    return {
      developers: devs,
      developerChallenges: devChallenges,
      developerSkills: devSkills,
      developerTools: devTools,
      interestedDevs: interestedDevelopers,
      teams: findTeams,
      skills: findSkills,
      challenges: findChallenges,
      tools: findTools,
    };
  }, []);

  const universalSkills = skills;

  const getDeveloperSkills = (developerID, developerSkillsGDS) => {
    const data = [];
    const skillsGDS = developerSkillsGDS.filter(skill => skill.developerID === developerID);
    for (let i = 0; i < skillsGDS.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skills[i].skillID === universalSkills[j]._id) {
          data.push({ name: universalSkills[j].name });
        }
      }
    }
    return data;
  };

  const universalDevs = developers;

  const getInterestedDevelopers = (devs) => {
    const data = [];
    for (let i = 0; i < devs.length; i++) {
      for (let j = 0; j < universalDevs.length; j++) {
        if (devs[i].participantID === universalDevs[j]._id) {
          data.push(universalDevs[j]);
        }
      }
    }
    return data;
  };

  const universalTools = tools;

  const getDeveloperTools = (developerID, developerToolsGDT) => {
    const data = [];
    const toolsGDT = developerToolsGDT.filter(tool => tool.developerID === developerID);
    for (let i = 0; i < toolsGDT.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (tools[i].toolID === universalTools[j]._id) {
          data.push({ name: universalTools[j].name });
        }
      }
    }
    return data;
  };

  const universalChallenges = challenges;

  const getDeveloperChallenges = (developerID, developerChallengesGDC) => {
    const data = [];
    const challengesGDC = developerChallengesGDC.filter(challenge => challenge.developerID === developerID);
    for (let i = 0; i < challengesGDC.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (challenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  };

  const InterestedPartList = () => (
      <Container id={PAGE_IDS.INTERESTED_PARTICIPANTS}>
        <Row>
          <h3 style={{ paddingTop: '2rem' }} className="mb-4 fw-bold text-center">
            Interested Participants for Team: {teams[0].name}
          </h3>
        </Row>
        <Row>
          <Card divided>
            {getInterestedDevelopers(interestedDevs).map((devs) => <InterestedParticipantCard
                key={devs._id} developers={devs}
                teams={teams}
                skills={getDeveloperSkills(devs._id, developerSkills)}
                tools={getDeveloperTools(devs._id, developerTools)}
                challenges={getDeveloperChallenges(devs._id, developerChallenges)}
            />)}
          </Card>
        </Row>
      </Container>
  );

  return interestedDevs.length === 0 ? <NoInterestedPart/> : <InterestedPartList/>;
};
export default InterestedParticipants;
