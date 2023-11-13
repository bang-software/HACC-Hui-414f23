import React from 'react';
import { Grid, Header, Segment, Table } from 'semantic-ui-react';
import { useTracker } from 'meteor/react-meteor-data';
import { Spinner } from 'react-bootstrap';
import ListMinorWidget from './ListMinorWidget';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { darkGreyStyle, greyStyle } from '../../styles';

const ManageMinorWidget = () => {
  const { ready, minorParticipants } = useTracker(() => {
    const sub1 = MinorParticipants.subscribe();
    const sub2 = Participants.subscribe();
    const rdy = sub1.ready() && sub2.ready();

    const mps = MinorParticipants.find({}).fetch();
    const MPList = [];
    mps.forEach((m) => {
      const result = m;
      result.username = Participants.findDoc(m.participantID).username;
      MPList.push(result);
    });
    return {
      ready: rdy,
      minorParticipants: MPList,
    };
  }, []);

  return (ready ? (
      <div style={{ greyStyle, paddingBottom: '50px' }}>
        <Grid container centered>
          <Grid.Column>
            <div style={{
              darkGreyStyle, padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <Header as="h2" textAlign="center" inverted>Minor Participant</Header>
              <Header as="h2" textAlign="center" inverted>{minorParticipants.length}</Header>
            </div>
            <Segment style={{
              borderRadius: '1rem',
              darkGreyStyle,
            }} className={'teamCreate'}>
              <Header as="h2" textAlign="center" inverted>Information</Header>
              <Table fixed columns={5}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={2}>Username</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Parent/Guardian:FirstName</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Parent/Guardian:LastName</Table.HeaderCell>
                    <Table.HeaderCell width={5}>Parent/Guardian:Email</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Approve</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{minorParticipants.map((mp => <ListMinorWidget key={mp._id} minorParticipants={mp}/>
                ))}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
  ) : <Spinner/>);
};

export default ManageMinorWidget;
