import React from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  description: String,
  submissionDetail: String,
  pitch: String,
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddChallenge = () => {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { title, description, submissionDetail, pitch } = data;
    const definitionData = { title, description, submissionDetail, pitch };
    const collectionName = Challenges.getCollectionName();
    console.log(collectionName);
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            // console.error(error.message);
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
            // console.log('Success');
          }
        });
  };

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return (
      <Container fluid id="addChallenge">
        <Col>
          <h2 style={{ textAlign: 'center' }}>Add a challenge</h2>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
            <Card style={{ padding: '20px', marginBottom: '20px' }}>
              <TextField id="addChallenge-title" name='title' />
              <TextField id="addChallenge-description" name='description' />
              <TextField id="addChallenge-submissionDetail" name='submissionDetail' />
              <TextField id="addChallenge-pitch" name='pitch' />
              <SubmitField id="addChallenge-submit" value='Submit' />
              <ErrorsField />
            </Card>
          </AutoForm>
        </Col>
      </Container>
  );
};

export default AddChallenge;
