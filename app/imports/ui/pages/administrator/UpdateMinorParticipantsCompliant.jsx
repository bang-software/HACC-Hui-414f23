import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { BalloonFill } from 'react-bootstrap-icons';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import UpdateMinorParticipantsWidget from '../../components/administrator/UpdateMinorParticipantsWidget';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const UpdateMinorParticipantsCompliant = () => {
  const { ready, NonCompliantMinorParticipantsID }
      = useTracker(() => {
    const sub1 = MinorParticipants.subscribe();
    const sub2 = Participants.subscribe();
    const rdy = sub1.ready() && sub2.ready();

    const AllMinorParticipants = MinorParticipants._collection.find({}).fetch();
    const CFParticipants = Participants._collection.find({ isCompliant: false }).fetch();
    const CFParticipantsID = CFParticipants.map(partici => partici._id);
    const AllMinorParticipantsID = AllMinorParticipants.map(mPartici => mPartici.participantID);
    // list of participantID's for non-compliant minors
    const MinorCFParticipantsID = AllMinorParticipantsID.filter(id => CFParticipantsID.includes(id));
    return {
      ready: rdy,
      NonCompliantMinorParticipantsID: MinorCFParticipantsID,
    };
  }, []);

  return (ready ? (
      <Container id={PAGE_IDS.UPDATE_MP_COMPLIANT}>
        {NonCompliantMinorParticipantsID.length === 0 ? (
          <div>
            <Row className="justify-content-center">
              <Col className="text-center"><h1>
                <BalloonFill/>
              </h1></Col>
            </Row>
            <Row className="justify-content-center">
              <Col className="text-center"><h2>
                There are no minor participants yet
              </h2></Col>
            </Row>
            <Row className="justify-content-center">
              <Col className="text-center"><h3>
                Please check back later.
              </h3></Col>
            </Row>
          </div>
      ) :
        <UpdateMinorParticipantsWidget MinorParticipantsID={NonCompliantMinorParticipantsID}/>
      }
      </Container>
  ) : <Spinner/>);

};

export default UpdateMinorParticipantsCompliant;
