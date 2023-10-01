import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../../../startup/client/route-constants';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { darkerBlueStyle } from '../../styles';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
export default function ParticipationForm() {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const submit = (formData) => {
    const { firstName, lastName, agree } = formData;
    if (agree) {
      const dev = Participants.findDoc({ userID: Meteor.userId() });
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: dev._id,
        isCompliant: agree,
      };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Could not update Participant', error);
        }
      });
      const interactionData = {
        username: dev.username,
        type: USER_INTERACTIONS.SIGNED_CONSENT,
        typeData: [firstName, lastName],
      };
      console.log(interactionData);
      userInteractionDefineMethod.call(interactionData, (error) => {
        if (error) {
          console.error('Could not define user interaction', error);
        }
      });
      setRedirectToReferer(true);
    }
  };

  if (redirectToReferer) {
    const from = { pathname: ROUTES.CREATE_PROFILE };
    return <Redirect to={from}/>;
  }

  return (
    <div id={PAGE_IDS.PARTICIPATION_FORM} style={{ marginTop: '20px' }}>
      <Card style={darkerBlueStyle}>
        <h2 style={{ padding: '10px' }}>HACC Registration</h2>
        <Card style={{ padding: '10px' }}>
          <Form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              firstName: e.target.firstName.value,
              lastName: e.target.lastName.value,
              agree: e.target.agree.checked,
            };
            submit(formData);
          }}>
            <Alert variant="info">
              Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
              <br />
              Then agree to the terms
            </Alert>
            <Form.Group className="row">
              <div className="col">
                <Form.Label>First Name</Form.Label>
                <Form.Control id={COMPONENT_IDS.PARTICIPATION_FORM_FIRST_NAME}
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              required/>
              </div>
              <div className="col">
                <Form.Label>Last Name</Form.Label>
                <Form.Control id={COMPONENT_IDS.PARTICIPATION_FORM_LAST_NAME}
                              type="text"
                              placeholder="Last Name"
                              name="lastName"
                              required/>
              </div>
            </Form.Group>
            <Form.Group style={{ padding: '10px' }}>
              <Form.Check
                id={COMPONENT_IDS.PARTICIPATION_FORM_AGREE_BUTTON}
                type="checkbox"
                label="I have read the rules and agree to the terms"
                name="agree"
                required />
            </Form.Group>
            <Button id={COMPONENT_IDS.PARTICIPATION_FORM_SUBMIT} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </Card>
    </div>
  );
}
