import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { dumpDatabaseMethod, dumpTeamCSVMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import DeleteConfirmation from '../../components/administrator/DeleteConfirmation';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const DumpDatabase = () => {
  const {
    allChallenges,
    allParticipants,
    allTeams,
  } = useTracker(() => {
    const userId = Meteor.userId();
    return {
      allChallenges: Challenges.find({}).fetch(),
      allParticipants: Participants.find({}).fetch(),
      allTeams: Teams.find({}).fetch(),
    };
  }, []);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');

  const handleClick = () => {
    dumpDatabaseMethod.call((error, result) => {
      if (error) {
        console.error('Problem dumping database.', error);
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  };

  const handleDumpTeamCSV = () => {
    dumpTeamCSVMethod.call((error, result) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-teams';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}-teams.txt`;
        zip.file(fileName, result.result);
        zip.saveAs(`${dir}.zip`);
      }
    });
  };

  const deleteUser = (participantID) => {
    if (participantID === '') {
      swal('Error', 'Please select a participant', 'error');
    } else {
      setSelectedUser('');
      const collectionName2 = Participants.getCollectionName();
      const intID = Participants.findDoc({
        _id: participantID,
      });
      removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        }
      });
    }
  };

  const deleteAllUsers = () => {
    allParticipants.map((participant) => deleteUser(participant._id));
  };

  const deleteTeam = (teamID) => {
    if (teamID === '') {
      swal('Error', 'Please select a team', 'error');
    } else {
      setSelectedTeam('');
      const collectionName2 = Teams.getCollectionName();
      const intID = Teams.findDoc({
        _id: teamID });
      removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        }
      });
    }
  };

  const deleteAllTeams = () => {
    allTeams.map((team) => deleteTeam(team._id));
  };

  const deleteChallenge = (challengeID) => {
    if (challengeID === '') {
      swal('Error', 'Please select a challenge', 'error');
    } else {
      setSelectedChallenge('');
      const collectionName2 = Challenges.getCollectionName();
      const intID = Challenges.findDoc({
        _id: challengeID,
      });
      removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        }
      });
    }
  };

  const deleteAllChallenges = () => {
    allChallenges.map((challenge) => deleteChallenge(challenge._id));
  };

  const resetHACC = () => {
    deleteAllUsers();
    deleteAllTeams();
    deleteAllChallenges();
  };

  return (
      <div id={PAGE_IDS.DUMP_DATABASE}>
        <Row >
          <Col lg="2">
            <Button variant="success"
                    id={COMPONENT_IDS.DUMP_DATABASE}
                    onClick={handleClick}
                    className="mt-3 ms-3"
            >
              Dump the Database
            </Button>
          </Col>
          <Col lg="2">
            <Button variant="success"
                    id={COMPONENT_IDS.DUMP_TEAM}
                    onClick={handleDumpTeamCSV}
                    className="mt-3 ms-3">
              Dump the Teams
            </Button>
          </Col>
        </Row>
        <Row>
          <Col lg="2">
            <Form.Select onChange={(e) => setSelectedUser(e.target.value)} className="mt-3 ms-3">
              <option>Select a user</option>
              {allParticipants.map((participant) => <option key={participant._id} value={participant._id}>
                {participant.username}
              </option>)}
            </Form.Select>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={() => deleteUser(selectedUser)}
                                description={selectedUser === '' ? 'nothing' : Participants.findDoc({
                                  _id: selectedUser,
                                }).username}
                                buttonLabel={'Delete User'}/>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={deleteAllUsers}
                                description={'All users'}
                                buttonLabel={'Delete All Users'}/>
          </Col>
        </Row>
        <Row>
          <Col lg="2">
            <Form.Select onChange={(e) => setSelectedTeam(e.target.value)} className="mt-3 ms-3">
              <option>Select a team</option>
              {allTeams.map((team) => <option key={team._id} value={team._id}>
                {team.name}
              </option>)}
            </Form.Select>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={() => deleteTeam(selectedTeam)}
                                description={selectedTeam === '' ? 'nothing' : Teams.findDoc({
                                  _id: selectedTeam,
                                }).name}
                                buttonLabel={'Delete Team'}/>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={deleteAllTeams}
                                description={'All teams'}
                                buttonLabel={'Delete All Teams'}/>
          </Col>
        </Row>
        <Row>
          <Col lg="2">
            <Form.Select onChange={(e) => setSelectedChallenge(e.target.value)} className="mt-3 ms-3">
              <option>Select a challenge</option>
              {allChallenges.map((challenge) => <option key={challenge._id} value={challenge._id}>
                {challenge.title}
              </option>)}
            </Form.Select>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={() => deleteChallenge(selectedChallenge)}
                                description={selectedChallenge === '' ? 'nothing' : Challenges.findDoc({
                                  _id: selectedChallenge,
                                }).title}
                                buttonLabel={'Delete Challenge'}/>
          </Col>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={deleteAllChallenges}
                                description={'All challenges'}
                                buttonLabel={'Delete All Challenges'}/>
          </Col>
        </Row>
        <Row>
          <Col lg="2">
            <DeleteConfirmation deleteFunction={resetHACC}
                                description={'All teams, challenges, participants, and their associated Meteor accounts'}
                                buttonLabel={'Reset HACC'}/>
          </Col>
        </Row>
      </div>
  );
};

export default DumpDatabase;
