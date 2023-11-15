import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { ZipZap } from 'meteor/udondan:zipzap';
import { Container, Row, Col, Button, Form, Card, ListGroup } from 'react-bootstrap';
import { Teams } from '../../../api/team/TeamCollection';
import ViewTeam from './ViewTeam';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const getTeamMembers = (team) => {
  const teamID = team._id;
  const teamParticipants = TeamParticipants.find({ teamID }).fetch();
  const memberNames = teamParticipants.map((tp) => {
    const fullName = Participants.getFullName(tp.participantID);
    const participant = Participants.findDoc(tp.participantID);
    const gitHub = participant.gitHub;
    return `${fullName}, (${gitHub})`;
  });
  return _.uniq(memberNames);
};

const ViewTeams = ({ participants, teams, teamChallenges, teamParticipants }) => {
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [filterValue, setFilterValue] = useState('None');
  // console.log(filteredTeams);
  const stickyStyle = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const teamIsCompliant = (teamID) => {
    const tps = teamParticipants.filter(tp => tp.teamID === teamID);
    let compliant = true;
    tps.forEach(tp => {
      const participant = participants.filter(p => p._id === tp.participantID);
      // console.log(participant);
      compliant = compliant && participant[0].isCompliant;
    });
    return compliant;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let remainingTeams = [];

    switch (value) {
      case 'Challenge':
        remainingTeams = teams.filter(team => {
          const challengeIDs = teamChallenges.filter(tc => tc.teamID === team._id);
          return challengeIDs.length === 0;
        });
        break;
      case 'NonCompliant':
        remainingTeams = teams.filter(team => !teamIsCompliant(team._id));
        break;
      case 'NoDevPost':
        remainingTeams = teams.filter(team => !team.devPostPage);
        break;
      case 'NoGitHub':
        remainingTeams = teams.filter(team => !team.gitHubRepo);
        break;
      default:
        remainingTeams = [...teams];
    }

    setFilterValue(value);
    setFilteredTeams(remainingTeams);
  };

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-team-captains';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-team-captains.txt`;
    const localTeams = filteredTeams;
    const ownerIDs = localTeams.map(t => t.owner);
    const emails = [];
    ownerIDs.forEach(id => {
      const pArr = participants.filter(p => p._id === id);
      emails.push(pArr[0].username);
    });
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  return (
      <Container className="mt-5 mb-5">
        <Row className="mb-4">
          <Col>
            <Card bg="light" className="text-center p-3 rounded">
              <Card.Title>View Teams ({filteredTeams.length})</Card.Title>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Button
              variant="primary"
              onClick={handleDownload}
              id={COMPONENT_IDS.DOWNLOAD_TEAM_CAPTAIN_EMAILS}
          >
            Download Team Captain emails
          </Button>
        </Row>
        <Row>
          <Col xs={4}>
            <Card className="position-sticky" style={{ top: '6.5rem' }}>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Select a filter</Form.Label>
                    <Form.Check type="radio" name="checkboxRadioGroup" value="NonCompliant"
                                checked={filterValue === 'NonCompliant'} onChange={handleChange}
                                label="Non Compliant" id={COMPONENT_IDS.FILTER_NON_COMPLIANT} />
                    <Form.Check type="radio" name="checkboxRadioGroup" value="NoDevPost"
                                checked={filterValue === 'NoDevPost'} onChange={handleChange}
                                label="No devpost" id={COMPONENT_IDS.FILTER_NO_DEV_POST}/>
                    <Form.Check type="radio" name="checkboxRadioGroup" value="NoGitHub"
                                checked={filterValue === 'NoGitHub'} onChange={handleChange}
                                label="No GitHub" id={COMPONENT_IDS.FILTER_NO_GITHUB}/>
                    <Form.Check type="radio" name="checkboxRadioGroup" value="None"
                                checked={filterValue === 'None'} onChange={handleChange}
                                label="None" id={COMPONENT_IDS.FILTER_NONE}/>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8}>
            <ListGroup>
              {filteredTeams.map((team) => (
                  <ViewTeam key={team._id}
                                   team={team}
                                   teamMembers={getTeamMembers(team)}
                                   isCompliant={teamIsCompliant(team._id)}
                  />
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
  );
};

ViewTeams.propTypes = {
  participants: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teams: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teamChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  teamParticipants: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const teams = Teams.find({}, { sort: { name: 1 } }).fetch();
  const teamChallenges = TeamChallenges.find({}).fetch();
  const teamParticipants = TeamParticipants.find({}).fetch();
  const participants = Participants.find({}).fetch();
  return {
    participants,
    teams,
    teamChallenges,
    teamParticipants,
  };
})(ViewTeams);
