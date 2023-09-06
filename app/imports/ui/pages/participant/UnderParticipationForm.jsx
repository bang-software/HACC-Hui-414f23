import React from 'react';
import { Container, Col, Card, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';

import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Participants } from '../../../api/user/ParticipantCollection';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { darkerBlueStyle, whiteStyle, greyStyle } from '../../styles';
// import { Redirect } from 'react-router-dom';
// import { ROUTES } from '../../../startup/client/route-constants';

const schema = new SimpleSchema({
  yourLastName: String,
  yourFirstName: String,
  parentFirstName: String,
  parentLastName: String,
  parentEmail: String,
});

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
const UnderParticipationForm = () => {

  const submit = (formData) => {
    const { firstName, lastName, parentFirstName, parentLastName, parentEmail } = formData;
    const dev = Participants.findDoc({ userID: Meteor.userId() });
    const username = dev.username;
    let collectionName = MinorParticipants.getCollectionName();
    const definitionData = {
      username,
      parentFirstName,
      parentLastName,
      parentEmail,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Problem defining MinorParticipant', error);
      }
    });
    const interactionData = {
      username: dev.username,
      type: USER_INTERACTIONS.MINOR_SIGNED_CONSENT,
      typeData: [firstName, lastName, parentFirstName, parentLastName, parentEmail],
    };
    console.log(interactionData);
    userInteractionDefineMethod.call(interactionData, (error) => {
      if (error) {
        console.error('Could not define user interaction', error);
      }
    });
    collectionName = Participants.getCollectionName();
    const updateData = {
      id: dev._id,
      minor: true,
    };
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Could not update minor status', error);
      }
    });
  };

  /*
  // Not sure how to do this without states so... yeah
  if (this.state.redirectToReferer) {
    const from = { pathname: ROUTES.CREATE_PROFILE };
    return <Redirect to={from} />;
  }
   */
  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
      <Container fluid id={'under-participation'}>
        <Card style={darkerBlueStyle}>
          <Row>
            <Col>
              <Card.Title>  HACC Registration</Card.Title>
            </Col>
          </Row>
          <Card.Body>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Card.Body style={whiteStyle}>
                <Row>
                  <Col>
                    <Card.Body style={greyStyle}>
                      Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>.
                      <br/>
                      Then agree to the terms.
                    </Card.Body>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col>
                    <TextField name='yourFirstName'/>
                  </Col>
                  <Col>
                    <TextField name='yourLastName'/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField name='parentFirstName' label="Parent/Guardian First Name"/>
                  </Col>
                  <Col>
                    <TextField name='parentLastName' label="Parent/Guardian Last Name"/>
                  </Col>
                  <Col>
                    <TextField name='parentEmail' label="Parent/Guardian Email"/>
                  </Col>
                </Row>
                <SubmitField/>
                <ErrorsField/>
              </Card.Body>
            </AutoForm>
          </Card.Body>
        </Card>
      </Container>
  );
};

export default UnderParticipationForm;
