import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Spinner, Row, Col, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import ListTeamsWidget from '../../components/participant/ListTeamsWidget';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { paleBlueStyle } from '../../styles';
import { PAGE_IDS } from '../../testIDs/pageIDs';

/** Renders a table containing all of the Book documents. Use <BookItem> to render each row. */
const BestTeam = () => {
  const {
    ready,
  } = useTracker(() => {
    const subscriptionChallenges = Challenges.subscribe();
    const subscriptionSkills = Skills.subscribe();
    const subscriptionTools = Tools.subscribe();
    const subscriptionDevelopers = Participants.subscribe();
    const subscriptionTeams = Teams.subscribe();
    const subscriptionDeveloperChallenges = ParticipantChallenges.subscribe();
    const subscriptionTeamChallenges = TeamChallenges.subscribe();
    const subscriptionDeveloperSkill = ParticipantSkills.subscribe();
    const subscriptionDeveloperTools = ParticipantTools.subscribe();
    const subscriptionTeamSkill = TeamSkills.subscribe();
    const subscriptionTeamTool = TeamTools.subscribe();
    const subscriptionWantToJoin = WantsToJoin.subscribe();
    return {
      ready:
          subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready()
          && subscriptionDevelopers.ready() && subscriptionTeams.ready() && subscriptionDeveloperChallenges.ready()
          && subscriptionTeamChallenges.ready() && subscriptionDeveloperSkill.ready() && subscriptionTeamSkill.ready()
          && subscriptionTeamTool.ready() && subscriptionDeveloperTools.ready() && subscriptionWantToJoin.ready(),
    };
  });

  const [select, setSelect] = useState('default');

  const getDeveloper = () => Participants.findOne({ username: Meteor.user().username });

  const getAllOpenTeams = () => {
    const teamsGAPT = Teams.find({ open: true }).fetch();
    return teamsGAPT;
  };

  const byAtoZ = () => {
    const allTeams = getAllOpenTeams();

    return allTeams.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  };

  const byChallengeMatch = () => {
    const participantID = getDeveloper()._id;
    const pChallenges = ParticipantChallenges.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();

    allTeams.forEach(team => {
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      const participantChallengeIDs = pChallenges.map(pc => pc.challengeID);
      const teamChallengeIDs = tChallenges.map(tc => tc.challengeID);

      // eslint-disable-next-line no-param-reassign
      team.priority = teamChallengeIDs.filter(id => participantChallengeIDs.includes(id)).length;
    });
    return allTeams.sort((a, b) => a.priority - b.priority).reverse();
  };

  const bySkillMatch = () => {
    const participantID = getDeveloper()._id;
    const pSkills = ParticipantSkills.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();

    allTeams.forEach(team => {
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      const participantSkillIDs = pSkills.map(ps => ps.skillID);
      const teamSkillIDs = tSkills.map(ts => ts.skillID);

      // eslint-disable-next-line no-param-reassign
      team.priority = teamSkillIDs.filter(id => participantSkillIDs.includes(id)).length;
    });
    return allTeams.sort((a, b) => a.priority - b.priority).reverse();
  };

  const byToolMatch = () => {
    const participantID = getDeveloper()._id;
    const pTools = ParticipantTools.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();

    allTeams.forEach(team => {
      const tTools = TeamTools.find({ teamID: team._id }).fetch();
      const participantToolIDs = pTools.map(pt => pt.toolID);
      const teamToolIDs = tTools.map(tt => tt.toolID);

      // eslint-disable-next-line no-param-reassign
      team.priority = teamToolIDs.filter(id => participantToolIDs.includes(id)).length;
    });
    return allTeams.sort((a, b) => a.priority - b.priority).reverse();
  };

  const byBestMatch = () => {
    const participantID = getDeveloper()._id;
    const pChallenges = ParticipantChallenges.find({ participantID }).fetch();
    const pSkills = ParticipantSkills.find({ participantID }).fetch();
    const pTools = ParticipantTools.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();

    allTeams.forEach(team => {
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      const tTools = TeamTools.find({ teamID: team._id }).fetch();

      const challengeMatch = tChallenges.filter(tc => pChallenges.some(pc => pc.challengeID === tc.challengeID)).length * 5;
      const skillMatch = tSkills.filter(ts => pSkills.some(ps => ps.skillID === ts.skillID)).length;
      const toolMatch = tTools.filter(tt => pTools.some(pt => pt.toolID === tt.toolID)).length;

      // eslint-disable-next-line no-param-reassign
      team.priority = challengeMatch + skillMatch + toolMatch;
    });
    return allTeams.sort((a, b) => a.priority - b.priority).reverse();
  };

  const renderDropDown = () => {
    const _select = (e) => {
      setSelect(e.target.value);
    };
    const options = [
      { key: 0, text: 'Select an option to reorder the team', value: '' },
      { key: 1, text: 'sort the teams by the challenges that match your challenges', value: 'default' },
      { key: 2, text: 'sort by best fit teams', value: 'best' },
      { key: 3, text: 'sort the teams by the skills that match your skills', value: 'skill' },
      { key: 4, text: 'sort the teams by the tools that match your tools', value: 'tool' },
      { key: 5, text: 'sort the teams by the name in alphabet order', value: 'AToZ' },
    ];

    return (
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <h3>Please select a filter to reorder the teams: </h3>
              </Col>
              <Col>
                <Form>
                  <Form.Group style={{ fontSize: `${20}px`, width: 'device-width' }}>
                    <Form.Select
                        onChange={_select}
                    >
                      {options.map((option) => <option key={option.key} value={option.value}>{option.text}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
    );
  };

  const renderPage = () => {
    let teamsSelect;
    switch (select) {
      case 'skill':
        teamsSelect = bySkillMatch();
        break;
      case 'tool':
        teamsSelect = byToolMatch();
        break;
      case 'AToZ':
        teamsSelect = byAtoZ();
        break;
      case 'best':
        teamsSelect = byBestMatch();
        break;
      default:
        teamsSelect = byChallengeMatch();
    }
    return (
        <div style={{ paddingBottom: '50px', paddingTop: '40px' }} id={PAGE_IDS.BEST_FIT_TEAM}>
          <Container>
            <Card style={paleBlueStyle}>
              <Card.Body>
                <h2 className="text-center">
                  Open Teams
                </h2>
                <Card>
                  {renderDropDown()}
                    <ListTeamsWidget teams={teamsSelect}/>
                </Card>
              </Card.Body>
            </Card>
          </Container>
        </div>
    );
  };

  return (ready) ? renderPage() :
      <Spinner animation="border" role="status">
        <span className="sr-only">Getting data...</span>
      </Spinner>;
};

export default BestTeam;
