import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Col, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { deleteAccountMethod, userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const reasons = [
  {
    label: 'No challenge was interesting for me',
    value: 'No challenge was interesting for me',
  },
  {
    label: 'The challenges were too hard',
    value: 'The challenges were too hard',
  },
  {
    label: "Couldn't find a team I liked being on",
    value: "Couldn't find a team I liked being on",
  },
  {
    label: 'My schedule conflicts with the HACC',
    value: 'My schedule conflicts with the HACC',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];
const schema = new SimpleSchema({
  feedback: {
    type: String,
    defaultValue: 'Other',
  },
  other: { type: String, required: false },
});

const DeleteFormWidget = () => {
  const { participant } = useTracker(() => {
    const userID = Meteor.userId();
    let participantData = {};

    if (Participants.isDefined(userID)) {
      participantData = Participants.findDoc({ userID });
    }

    return {
      participant: participantData,
    };
  }, []);

  const submit = (data) => {
    const username = participant.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction, (error) => (error ?
            swal('Error', error.message, 'error') :
            swal('Account deleted', 'We hope to see you again!', 'success')
                .then(() => {
                  // eslint-disable-next-line no-undef
                  window.location = '/';
                })
    ));
    const selector = { owner: participant._id };
    const ownedTeams = Teams.find(selector).fetch();
    ownedTeams.forEach((team) => {
      const selector2 = { teamID: team._id };
      const teamParticipants = TeamParticipants.find(selector2).fetch();
      if (teamParticipants.length === 1) {
        const instance = team._id;
        const collectionName = Teams.getCollectionName();
        removeItMethod.call({ collectionName, instance });
      } else {
        let newOwner = teamParticipants[0].participantID;
        if (newOwner === participant._id) {
          newOwner = teamParticipants[1].participantID;
        }
        Teams.update(team._id, { newOwner });
      }
    });
    const collectionName = Participants.getCollectionName();
    const instance = participant._id;
    removeItMethod.call({ collectionName, instance });
    deleteAccountMethod.call();
  };

    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Container style={{ justifyContent: 'center', padding: '5px' }}>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Feedback</h2>
            <AutoForm schema={formSchema} onSubmit={data => {
              swal({
                text: 'Are you sure you want to delete your account?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
              })
                  .then((willDelete) => {
                    if (willDelete) {
                      submit(data);
                    } else {
                      swal('Canceled deleting your account');
                    }
                  });
            }}>
              <Card style={{ padding: '10px' }}>
                <h4>We&apos;re sorry to hear you&apos;re deleting your account.</h4>
                <h5>Please provide feedback on why you&apos;re leaving
                  to improve the HACC experience for next year.</h5>
                <br/>
                <Container style={{ justifyContent: 'center', padding: '5px' }}>
                  <Row>
                    <Col>
                      <SelectField name='feedback' options={reasons} id={COMPONENT_IDS.DELETE_ACCOUNT_SELECT}/>
                    </Col>
                    <Col>
                      <LongTextField name='other' id={COMPONENT_IDS.DELETE_ACCOUNT_TEXT}/>
                    </Col>
                  </Row>
                </Container>
                <SubmitField value='Delete Account' id={COMPONENT_IDS.DELETE_ACCOUNT_BUTTON}>
                </SubmitField>
                <ErrorsField/>
              </Card>
            </AutoForm>
          </Col>
        </Container>
    );
};

export default withRouter(DeleteFormWidget);
