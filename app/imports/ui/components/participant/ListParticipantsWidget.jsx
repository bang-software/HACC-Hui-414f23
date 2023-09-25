import React, { useState, useEffect } from 'react';
import {
  Grid,
  Header,
  Item,
  Icon,
  Segment,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantsCard from './ListParticipantsCard';
import ListParticipantsFilter from './ListParticipantsFilter';

const ListParticipantsWidget = (
    { participants, challenges, tools, skills, participantChallenges, participantSkills, participantTools, teams },
) => {

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

  const filters = new ListParticipantsFilter();

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

  const getSkills = (event, { value }) => {
    setSkillsS(value);
  };
  const getTools = (event, { value }) => {
    setToolsS(value);
  };

  const getChallenge = (event, { value }) => {
    setChallengesS(value);
  };

  const getTeam = (event, { value }) => {
    setTeamS(value);
  };

  const universalSkills = skills;

  const getParticipantSkills = (participantID, participantSkillsGPS) => {
    const data = [];
    const skillsGPS = _.filter(participantSkillsGPS, { participantID: participantID });
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
    const toolsGPT = _.filter(participantToolsGPT, { participantID: participantID });
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
    const challengesGPC = _.filter(participantChallengesGPC, { participantID: participantID });
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
        <Header as='h2' icon>
          <Icon name='users'/>
          There are no participants at the moment.
          <Header.Subheader>
            Please check back later.
          </Header.Subheader>
        </Header>
      </div>
  );

  const participantList = () => (
      <div style={{ paddingBottom: '50px' }}>
        <Grid container doubling relaxed stackable centered>
          <Grid.Row centered>
            <Grid.Column width={16}>
              <div style={{
                backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as={'h2'} textAlign="center">
                  All Participants
                </Header>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={4}>
            <Segment style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <Header>
                  <Header.Content>
                    Total Participants: {resultS.length}
                  </Header.Content>
                </Header>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Input icon='search'
                       iconPosition='left'
                       placeholder='Search by participants name...'
                       onChange={handleSearchChange}
                       fluid
                />
                <div style={{ paddingTop: '2rem' }}>
                  <Header>Teams</Header>
                  <Dropdown
                      placeholder='Teams'
                      fluid
                      multiple
                      search
                      selection
                      options={filters.dropdownValues(teams, 'name')}
                      onChange={getTeam}
                  />
                </div>

                <div style={{ paddingTop: '2rem' }}>
                  <Header>Challenges</Header>
                  <Dropdown
                      placeholder='Challenges'
                      fluid
                      multiple
                      search
                      selection
                      options={filters.dropdownValues(challenges, 'title')}
                      onChange={getChallenge}
                  />
                </div>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Header>Skills</Header>
                <Dropdown placeholder='Skills'
                          fluid
                          multiple
                          search
                          selection
                          options={filters.dropdownValues(skills, 'name')}
                          onChange={getSkills}
                />
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Header>Tools</Header>
                <Dropdown
                    placeholder='Tools'
                    fluid
                    multiple
                    search
                    selection
                    options={filters.dropdownValues(tools, 'name')}
                    onChange={getTools}
                />
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Item.Group divided>
              {resultS.map((p) => <ListParticipantsCard
                  key={p._id}
                  participantID={p._id}
                  participants={p}
                  skills={getParticipantSkills(p._id, participantSkills)}
                  tools={getParticipantTools(p._id, participantTools)}
                  challenges={getParticipantChallenges(p._id, participantChallenges)}
              />)}
            </Item.Group>
          </Grid.Column>
        </Grid>
      </div>
  );

  return participants.length === 0 ? noParticipant() : participantList();
};

ListParticipantsWidget.propTypes = {
  participantChallenges: PropTypes.array.isRequired,
  participantSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participantTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,

};

export default withTracker(() => ({
  participantChallenges: ParticipantChallenges.find({}).fetch(),
  participantSkills: ParticipantSkills.find({}).fetch(),
  participantTools: ParticipantTools.find({}).fetch(),
  teams: Teams.find({ open: true }).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenges.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),

}))(ListParticipantsWidget);
