import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Redirect } from 'react-router-dom';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddChallenge = () => {

  const [redirect, setRedirect] = useState(false);

  // Create a schema to specify the structure of the data to appear in the form.
  const schema = new SimpleSchema({
    title: String,
    description: String,
    submissionDetail: String,
    pitch: String,
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { title, description, submissionDetail, pitch } = data;
    const definitionData = { title, description, submissionDetail, pitch };
    const collectionName = Challenges.getCollectionName();
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
            setRedirect(true);
          }
        });
  };

  if (redirect) {
    return <Redirect to={ROUTES.CONFIGURE_HACC} />;
  }

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
      <Container id={PAGE_IDS.ADD_CHALLENGE}>
        <Col>
          <Row className="title">
            <h2>Add a challenge</h2>
          </Row>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
            <Row>
              <Col className='cardStyle'>
                <TextField id={COMPONENT_IDS.ADD_CHALLENGE_TITLE} name='title'/>
                <TextField id={COMPONENT_IDS.ADD_CHALLENGE_DESCRIPTION} name='description'/>
                <TextField id={COMPONENT_IDS.ADD_CHALLENGE_SUBMISSION_DETAIL} name='submissionDetail'/>
                <TextField id={COMPONENT_IDS.ADD_CHALLENGE_PITCH} name='pitch'/>
                <SubmitField id={COMPONENT_IDS.ADD_CHALLENGE_SUBMIT} value='Submit'/>
                <ErrorsField/>
              </Col>
            </Row>
          </AutoForm>
        </Col>
      </Container>
  );
};

export default AddChallenge;
