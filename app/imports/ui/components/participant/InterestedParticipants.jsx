import React from 'react';
import {
    Grid,
    Header,
    Item,
    Icon,
} from 'semantic-ui-react';
import { useTracker } from 'meteor/react-meteor-data';
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

const NoInterestedPart = () => (
    <div className="text-center">
        <Header as='h2' icon>
            <Icon name='users'/>
            There are no interested partcipants at the moment.
            <Header.Subheader>
                Please check back later.
            </Header.Subheader>
        </Header>
    </div>
);

/**
 * Renders the interested participants
 * @memberOf ui/pages
 */
const InterestedParticipants = () => {
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
    // eslint-disable-next-line no-undef
    let url = window.location.href;
    url = url.split('/');
    const documentId = url[url.length - 1];

    const universalSkills = skills;

    function getDeveloperSkills(developerID, developerSkillsGDS) {
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
    }

    const universalDevs = developers;

    function getInterestedDevelopers(devs) {
        const data = [];
        for (let i = 0; i < devs.length; i++) {
            for (let j = 0; j < universalDevs.length; j++) {
                if (devs[i].participantID === universalDevs[j]._id) {
                    data.push(universalDevs[j]);
                }
            }
        }
        return data;
    }

    const universalTools = tools;

    function getDeveloperTools(developerID, developerToolsGDT) {
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
    }

    const universalChallenges = challenges;

    function getDeveloperChallenges(developerID, developerChallengesGDC) {
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
    }

    const InterestedPartList = () => (
            <Grid container doubling relaxed stackable style={{ marginBottom: '2rem' }}>
                <Grid.Row centered>
                    <Header as={'h2'} style={{ paddingTop: '2rem' }}>
                        Interested Participants for Team: {teams[0].name}
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Item.Group divided>
                            {getInterestedDevelopers(interestedDevs).map((developers) => <InterestedParticipantCard
                                    key={developers._id} developers={developers}
                                    teams={teams}
                                    skills={getDeveloperSkills(developers._id, developerSkills)}
                                    tools={getDeveloperTools(developers._id, developerTools)}
                                    challenges={getDeveloperChallenges(developers._id, developerChallenges)}
                                />)}
                        </Item.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

    return interestedDevs.length === 0 ? <NoInterestedPart/> : <InterestedPartList/>;
};
export default InterestedParticipants;
