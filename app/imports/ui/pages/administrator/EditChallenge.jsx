import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Redirect, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { ROUTES } from '../../../startup/client/route-constants';

const EditChallenge = () => {
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    title: String, description: String, submissionDetail: String, pitch: String,
  });
  const documentId = useParams();
  const { doc } = useTracker(() => {
    const document = Challenges.findOne(documentId);
    return {
      doc: document,
    };
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const submit = (data) => {
    const { description, submissionDetail, pitch } = data;
    const id = documentId._id;
    const updateData = { id, description, submissionDetail, pitch };
    const collectionName = Challenges.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Item edited successfully', 'success');
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to={ROUTES.CONFIGURE_HACC}/>;
  }

  const formSchema = new SimpleSchema2Bridge(schema);
  return (<Container id={PAGE_IDS.EDIT_CHALLENGE_PAGE}>
        <Col>
          <Row className="title">
            <h2>Edit Challenge</h2>
          </Row>
          <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
            <Row>
              <Col className='cardStyle'>
                <LongTextField name='description' id={COMPONENT_IDS.EDIT_CHALLENGE_DESCRIPTION} required/>
                <TextField name='submissionDetail' id={COMPONENT_IDS.EDIT_CHALLENGE_SUBMISSION_DETAIL} required/>
                <TextField name='pitch' id={COMPONENT_IDS.EDIT_CHALLENGE_PITCH} required/>
                <SubmitField value='Submit' id={COMPONENT_IDS.EDIT_CHALLENGE_SUBMIT}/>
                <ErrorsField/>
              </Col>
            </Row>
          </AutoForm>
        </Col>
      </Container>);
};

export default withAllSubscriptions(EditChallenge);
