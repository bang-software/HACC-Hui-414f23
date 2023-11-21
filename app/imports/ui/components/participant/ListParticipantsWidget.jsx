import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Container, Row, Col, InputGroup, FormControl, Card, ListGroup } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantsCard from './ListParticipantsCard';
import * as filters from './ListParticipantsFilter';

/**
 * Widget that list the participants from a user pov
 * @param participants
 * @param challenges
 * @param tools
 * @param skills
 * @param participantChallenges
 * @param participantSkills
 * @param participantTools
 * @param teams
 * @returns {*}
 */
const ListParticipantsWidget = () => {
  const {
    participantChallenges,
    participantSkills,
    participantTools,
    teams,
    skills,
    challenges,
    tools,
    participants,
  } = useTracker(() => ({
    participantChallenges: ParticipantChallenges.find({}).fetch(),
    participantSkills: ParticipantSkills.find({}).fetch(),
    participantTools: ParticipantTools.find({}).fetch(),
    teams: Teams.find({ open: true }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    participants: Participants.find({}).fetch(),
  }));

  const [searchS, setSearchS] = useState('');
  const [challengesS, setChallengesS] = useState([]);
  const [teamsS, setTeamS] = useState([]);
  const [toolsS, setToolsS] = useState([]);
  const [skillsS, setSkillsS] = useState([]);
  const [resultS, setResultS] = useState(_.orderBy(participants, ['name'], ['asc']));

  const sticky = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const setFilters = () => {
    const searchResults = filters.filterBySearch(participants, searchS);
    const skillResults = filters.filterBySkills(skillsS,
        skills, participantSkills, searchResults);
    const toolResults = filters.filterByTools(toolsS,
        tools, participantTools, skillResults);
    const challengeResults = filters.filterByChallenge(challengesS,
        challenges, participantChallenges, toolResults);
    const sorted = filters.sortBy(challengeResults, 'participants');
    setResultS(sorted);
  };

  const handleSearchChange = (event) => {
    setSearchS(event.target.value);
  };

  useEffect(() => {
    setFilters();
  }, [searchS, toolsS, skillsS, challengesS, teamsS]);

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
    setTeamS(event.map(e => e.value));
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

  const noParticipant = () => (
      <div style={{ textAlign: 'center' }}>
        <h2>
          <Icon.PersonCircle />
          There are no participants at the moment. Please check back later.
        </h2>
      </div>
  );

  const participantList = () => (
      <div style={{ paddingBottom: '50px' }}>
        <Container>
          <Row>
            <Col>
              <div style={{
                backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <h2 className="text-center fw-bold">
                  All Participants
                </h2>
              </div>
            </Col>
          </Row>
          <Row>
          <Col md={3}>
            <Card style={sticky}>
              <Card.Body>
              <div style={{ paddingTop: '2rem' }}>
                  <h5 className="fw-bold">
                    Total Participants: {resultS.length}
                  </h5>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <Icon.Search/>
                    </InputGroup.Text>
                  <FormControl
                      placeholder="Search by participants name..."
                      onChange={handleSearchChange}
                  />
                </InputGroup>
                <div style={{ paddingTop: '2rem' }}>
                  <h5 className="fw-bold">Teams</h5>
                  <Select
                      isMulti
                      options={filters.dropdownValues(teams, 'name')}
                      onChange={getTeam}
                  />
                </div>
                <div style={{ paddingTop: '2rem' }}>
                  <h5 className="fw-bold">Challenges</h5>
                  <Select
                      isMulti
                      options={filters.dropdownValues(challenges, 'title')}
                      onChange={getChallenge}
                  />
                </div>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <h5 className="fw-bold">Skills</h5>
                <Select
                    isMulti
                    options={filters.dropdownValues(skills, 'name')}
                    onChange={getSkills}
                />
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <h5 className="fw-bold">Tools</h5>
                <Select
                    isMulti
                    options={filters.dropdownValues(tools, 'name')}
                    onChange={getTools}
                />
              </div>
                </Card.Body>
            </Card>
          </Col>
          <Col>
            <ListGroup>
              {resultS.map((p) => <ListParticipantsCard
                  key={p._id}
                  participantID={p._id}
                  participants={p}
                  skills={getParticipantSkills(p._id, participantSkills)}
                  tools={getParticipantTools(p._id, participantTools)}
                  challenges={getParticipantChallenges(p._id, participantChallenges)}
              />)}
            </ListGroup>
          </Col>
          </Row>
        </Container>
      </div>
  );

  return participants.length === 0 ? noParticipant() : participantList();
};

export default ListParticipantsWidget;
