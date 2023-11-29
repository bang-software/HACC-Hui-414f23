import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Button, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Participants } from '../../../api/user/ParticipantCollection';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';
import { paleBlueStyle } from '../../styles';

const UpdateMinorParticipantsWidget = ({ MinorParticipantsID }) => {

  UpdateMinorParticipantsWidget.propTypes = {
    MinorParticipantsID: PropTypes.arrayOf(
        PropTypes.string,
    ).isRequired,
  };

  let selected = [];
  const { ready, MinorParticipantsList } = useTracker(() => {
    const sub1 = MinorParticipants.subscribe();
    const sub2 = Participants.subscribe();
    const rdy = sub1.ready() && sub2.ready();

    const MPList = [];
    MinorParticipantsID.forEach((MPID) => {
      const MinorParticipant = Participants._collection.findOne({ _id: MPID });
      const MinorP = MinorParticipants._collection.findOne({ participantID: MPID });
      const ParentName = `${MinorP.parentFirstName} ${MinorP.parentLastName} (${MinorP.parentEmail})`;
      MinorParticipant.ParentName = ParentName;
      MPList.push(MinorParticipant);
    });
    return {
      ready: rdy,
      MinorParticipantsList: MPList,
    };
  }, []);

  const CheckBoxFunc = {};
  MinorParticipantsID.forEach((MP) => {
    CheckBoxFunc[MP] = (checked) => {
      if (checked) selected.push(MP);
      else selected = selected.filter((Minor) => Minor !== MP);
    };
  });

  const download = () => {
    let csv = 'Minor Participant Name, Participant email, Parent/Guardian Name (Parent/Guardian email)\n';
    MinorParticipantsList.forEach((m) => {
      csv = `${csv}${m.firstName} ${m.lastName},${m.username},${m.ParentName}\n`;
    });
    const zip = new ZipZap();
    const dir = 'hacchui-minor-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-minor-participants.csv`;
    zip.file(fileName, csv);
    zip.saveAs(`${dir}.zip`);
  };

  const submitData = () => {
    let Error = false;
    selected.forEach((MP => {
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: MP,
        isCompliant: true,
      };

      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          Error = true;
          console.error('Could not update Participant', error);
        }
      });
    }));

    if (!Error) {
      swal('Success', 'Updated successfully', 'success');
    } else swal('Fail', 'Updated fail', 'error');

  };

  return (ready ? (
      <Container style={{ paddingBottom: '50px' }}>
        <Container style={{
          backgroundColor: paleBlueStyle, padding: '1rem 0rem', margin: '2rem 0rem',
          borderRadius: '2rem',
        }}>
          <h2>Minor Participants List ({MinorParticipantsID.length})</h2>
          <Button color="green" onClick={download}>Download minor participants</Button>
        </Container>
        <Form style={{
          borderRadius: '1rem',
          backgroundColor: paleBlueStyle,
        }}>
          <Table>
            <thead>
            <tr>
              <th>Minor Participant Name</th>
              <th>Parent Name (Email)</th>
              <th>Compliant</th>
            </tr>
            </thead>
            <tbody>
            {MinorParticipantsList.map((p) => (
                <tr key={p._id}>
                  <td>{`${p.firstName} ${p.lastName}`}</td>
                  <td>{p.ParentName}</td>
                  <td>
                    <Form.Check aria-label={`${p._id}_check`} value={p._id}
                                onClick={({ target: { checked } }) => CheckBoxFunc[p._id](checked)}/>
                  </td>
                </tr>))
            }
            </tbody>
          </Table>
          <Row className="justify-content-center">
            <Col className="text-center">
              <Button type='submit' style={{
                textAlign: 'center', color: 'white', backgroundColor: 'red',
                margin: '2rem 0rem',
              }} onClick={submitData}>submit</Button>
            </Col>
          </Row>
        </Form>
      </Container>
  ) : <Spinner/>);
};

export default UpdateMinorParticipantsWidget;
