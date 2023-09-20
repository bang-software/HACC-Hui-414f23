import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Form, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { ROUTES } from '../../../startup/client/route-constants';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { darkerBlueStyle } from '../../styles';
import { PAGE_IDS } from '../../testIDs/pageIDs'

const schema = new SimpleSchema({
  lastName: String,
  firstName: String,
  agree: { type: Boolean, optional: false },
});

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
      <div id={PAGE_IDS.PARTICIPATION_FORM} style={darkerBlueStyle}>
        <h1>HACC Registration</h1>
        <Form onSubmit={(e) => {
          e.preventDefault();
          const formData = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            agree: e.target.agree.checked,
          };
        }}>
        <Alert variant="info">
          Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          <br />
          Then agree to the terms
        </Alert>
        </Form>
      </div>
  );
}

