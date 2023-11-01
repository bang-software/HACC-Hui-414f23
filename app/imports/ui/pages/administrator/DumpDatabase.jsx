import React from 'react';
import { Button } from 'react-bootstrap';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import swal from 'sweetalert';

import { dumpDatabaseMethod, dumpTeamCSVMethod } from '../../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const DumpDatabase = () => {

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

  return (
      <div className="card mt-3 mx-5" id={PAGE_IDS.DUMP_DATABASE}>
        <Button variant="success"
                id={COMPONENT_IDS.DUMP_DATABASE}
                onClick={handleClick}
                className="mb-3"
        >
          Dump the Database
        </Button>
        <Button variant="success" id={COMPONENT_IDS.DUMP_TEAM} onClick={handleDumpTeamCSV}>Dump the Teams</Button>
      </div>
  );
};

export default DumpDatabase;
