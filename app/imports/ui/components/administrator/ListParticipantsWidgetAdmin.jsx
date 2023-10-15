import React, { useEffect, useState } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantsFilterAdmin from './ListParticipantsFilterAdmin';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';
import ListParticipantCardAdmin from './ListParticipantsCardAdmin';

const ListParticipantsWidgetAdmin = () => {
  const {
    participantChallenges,
    participantSkills,
    participantTools,
    teams,
    teamParticipants,
    skills,
    challenges,
    tools,
    participants,
  } = useTracker(() => ({
    participantChallenges: ParticipantChallenges.find({}).fetch(),
    participantSkills: ParticipantSkills.find({}).fetch(),
    participantTools: ParticipantTools.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    teamParticipants: TeamParticipants.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    participants: Participants.find({}).fetch(),
  }));

  const [searchS, setSearchS] = useState('');
  const [challengesS, setChallengesS] = useState([]);
  const [toolsS, setToolsS] = useState([]);
  const [skillsS, setSkillsS] = useState([]);
  const [teamsS, setTeamsS] = useState([]);
  const [noTeamCheckboxS, setNoTeamCheckboxS] = useState(false);
  const [multipleTeamsCheckboxS, setMultipleTeamsCheckboxS] = useState(false);
  const [compliantCheckboxS, setCompliantCheckboxS] = useState(false);
  const [resultS, setResultS] = useState(_.orderBy(participants, ['name'], ['asc']));

  const noParticipant = () => (
      <div style={{ textAlign: 'center' }}>
        <h2>
          <Icon.PersonCircle/>
          There are no participants at the moment.
          <h3>
            Please check back later.
          </h3>
        </h2>
      </div>
  );

  const sticky = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const filters = new ListParticipantsFilterAdmin();

  const setFilters = () => {
    const searchResults = filters.filterBySearch(participants, searchS);
    const skillResults = filters.filterBySkills(skillsS,
        skills, participantSkills, searchResults);
    const toolResults = filters.filterByTools(toolsS,
        tools, participantTools, skillResults);
    const challengeResults = filters.filterByChallenge(challengesS,
        challenges, participantChallenges, toolResults);
    const teamResults = filters.filterByTeam(teamsS, teams,
        teamParticipants, challengeResults);
    // const noTeamResults = filters.filterNoTeam(teamParticipants, teamResults);
    const sorted = _.uniqBy(filters.sortBy(teamResults, 'participants'), 'username');
    setResultS(sorted);
  };

  const handleSearchChange = (event) => {
    setSearchS(event.target.value);
  };

  const getSkills = (event) => {
    setSkillsS(event.map(e => e.value));
  };

  const getTools = (event) => {
    setToolsS(event.map(e => e.value));
  };

  const getChallenge = (event) => {
    setChallengesS(event.map(e => e.value));
  };

  const getTeam = (event) => {
    setTeamsS(event.map(e => e.value));
  };

  const universalSkills = skills;

  const getParticipantSkills = (participantID, participantSkillsGPS) => {
    const data = [];
    const skillsGPS = participantSkillsGPS.filter(skill => skill.participantID === participantID);
    for (let i = 0; i < skillsGPS.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skillsGPS[i].skillID === universalSkills[j]._id) {
          data.push({ name: universalSkills[j].name });
        }
      }
    }
    return data;
  };

  const universalTools = tools;

  const getParticipantTools = (participantID, participantToolsGPT) => {
    const data = [];
    const toolsGPT = participantToolsGPT.filter(tool => tool.participantID === participantID);
    for (let i = 0; i < toolsGPT.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (toolsGPT[i].toolID === universalTools[j]._id) {
          data.push({ name: universalTools[j].name });
        }
      }
    }
    return data;
  };

  const universalChallenges = challenges;

  const getParticipantChallenges = (participantID, participantChallengesGPC) => {
    const data = [];
    const challengesGPC = participantChallengesGPC.filter(challenge => challenge.participantID === participantID);
    for (let i = 0; i < challengesGPC.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (challengesGPC[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  };

  const universalTeams = teams;

  function getParticipantTeams(participantID, teamParticipantsGPT) {
    const data = [];
    const teamsGPT = _.filter(teamParticipantsGPT, { participantID: participantID });
    for (let i = 0; i < teamsGPT.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (teams[i].teamID === universalTeams[j]._id) {
          data.push(universalTeams[j].name);
        }
      }
    }
    return data;
  }

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-participants.txt`;
    const participantsHD = resultS;
    const emails = participantsHD.map(p => p.username);
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  const handleMultipleTeams = () => {
    if (!multipleTeamsCheckboxS) {
      const participantsHMT = resultS;
      const results = filters.filterMultipleTeams(participantsHMT, participants);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResultS(sorted);
    } else {
      setResultS(participants);
    }
    const checked = multipleTeamsCheckboxS;
    setMultipleTeamsCheckboxS(!checked);
  };

  const handleNoTeam = () => {
    if (!noTeamCheckboxS) {
      const participantsHNT = resultS;
      const results = filters.filterNoTeam(teamParticipants, participantsHNT);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResultS(sorted);
    } else {
      setResultS(participants);
    }
    const checked = noTeamCheckboxS;
    setNoTeamCheckboxS(!checked);
  };

  const handleNotCompliant = () => {
    if (!compliantCheckboxS) {
      const participantsHNC = resultS;
      const results = participantsHNC.filter(p => !p.isCompliant);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResultS(sorted);
    } else {
      setResultS(participants);
    }
    const checked = compliantCheckboxS;
    setCompliantCheckboxS(!checked);
  };

  const filterStyle = {
    paddingTop: 4,
  };

  useEffect(() => {
    setFilters();
  }, [searchS, toolsS, skillsS, challengesS, teamsS]);

  const participantList = () => (
      <div style={{ paddingBottom: '50px' }}>
        <Container>
          <Row>
            <Col>
              <div style={{
                backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <h2 className="text-center">
                  All Participants
                </h2>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={handleDownload}>Download emails</Button>
            </Col>
          </Row>
          <Row>
            <Col md={2} style={filterStyle}>
              <Card>
                <Card.Body style={sticky}>
                    <h4 className="fw-bold"> Filtered Participants </h4>
                    <h5 className="text-muted">
                      Total Participants: {resultS.length}
                    </h5>
                  <Form>
                    <Form.Check onChange={handleNoTeam} label="No Team"/>
                    <Form.Check onChange={handleMultipleTeams} label="Multiple Teams"/>
                    <Form.Check onChange={handleNotCompliant} label="Not Compliant"/>
                  </Form>
                  <div style={filterStyle}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <Icon.Search/>
                      </InputGroup.Text>
                      <FormControl
                          placeholder="Search by participants name..."
                          onChange={handleSearchChange}
                      />
                    </InputGroup>
                    <div style={filterStyle}>
                      <h3>Teams</h3>
                      <Select
                          isMulti
                          options={filters.dropdownValues(teams, 'name')}
                          onChange={getTeam}
                      />
                    </div>

                    <div style={filterStyle}>
                      <h3>Challenges</h3>
                      <Select
                          isMulti
                          options={filters.dropdownValues(challenges, 'title')}
                          onChange={getChallenge}
                      />
                    </div>
                  </div>
                  <div style={filterStyle}>
                    <h3>Skills</h3>
                    <Select
                        isMulti
                        options={filters.dropdownValues(skills, 'name')}
                        onChange={getSkills}
                    />
                  </div>
                  <div style={filterStyle}>
                    <h3>Tools</h3>
                    <Select
                        isMulti
                        options={filters.dropdownValues(tools, 'name')}
                        onChange={getTools}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={10}>
              <ListGroup>
                {resultS.map((p) => <ListParticipantCardAdmin
                    key={p._id}
                    participantID={p._id}
                    participants={p}
                    skills={getParticipantSkills(p._id, participantSkills)}
                    tools={getParticipantTools(p._id, participantTools)}
                    challenges={getParticipantChallenges(p._id, participantChallenges)}
                    teams={getParticipantTeams(p._id, teamParticipants)}
                />)}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
  );
  return participants.length === 0 ? noParticipant() : participantList();
};

export default ListParticipantsWidgetAdmin;
