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
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const DumpDatabase = () => {
  const {
    allChallenges,
    allSkills,
    allTools,
    allParticipants,
  } = useTracker(() => {
    const userId = Meteor.userId();
    return {
      allChallenges: Challenges.find({}).fetch(),
      allSkills: Skills.find({}).fetch(),
      allTools: Tools.find({}).fetch(),
      allParticipants: Participants.find({}).fetch(),
    };
  }, []);
  const [selectedUser, setSelectedUser] = useState('None');
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
    const collectionName2 = Participants.getCollectionName();
    const intID = Participants.findDoc({
      _id: participantID });
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Removed Participant', 'success');
      }
    });
  };

  const deleteAllUsers = () => {
    allParticipants.map((participant) => deleteUser(participant._id));
  };

  return (
      <div id={PAGE_IDS.DUMP_DATABASE}>
        <Row>
          <Col>
            <Button variant="success"
                    id={COMPONENT_IDS.DUMP_DATABASE}
                    onClick={handleClick}
                    className="mb-3"
            >
              Dump the Database
            </Button>
          </Col>
          <Col>
            <Button variant="success" id={COMPONENT_IDS.DUMP_TEAM} onClick={handleDumpTeamCSV}>Dump the Teams</Button>
          </Col>
          <Col>
            <Form.Select onChange={(e) => setSelectedUser(e.target.value)}>
              <option>Select a user</option>
              {allParticipants.map((participant) => <option key={participant._id} value={participant._id}>
                {participant.username}
              </option>)}
            </Form.Select>
            <Button variant="danger" onClick={() => deleteUser(selectedUser)}>
              Delete User
            </Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={deleteAllUsers}>
              Delete All Users
            </Button>
          </Col>
        </Row>
      </div>
  );
};

export default DumpDatabase;
