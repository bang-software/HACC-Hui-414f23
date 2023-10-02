import React from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  title: String,
  submissionDetail: String,
  pitch: String,
  description: String,
});

const EditChallengeWidget = ({ doc }) => {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const submit = (data) => {

    const { description, submissionDetail, pitch } = data;
    const id = doc._id;

    const updateData = {
      id, description, submissionDetail, pitch,
    };
    const collectionName = Challenges.getCollectionName();
    // console.log(updateData);
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item edited successfully', 'success');
          }
        });
  };

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <div style={{ paddingBottom: '50px' }}>
          <Container>
            <Col>
              <div style={{
                backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <h2 style={{ textAlign: 'center' }}>Edit Challenge</h2>
              </div>
              <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}
                        style={{
                          paddingBottom: '4rem',
                        }}>
                <Card style={{
                  borderRadius: '1rem',
                  backgroundColor: '#E5F0FE',
                }} className={'teamCreate'}>
                  <Container>
                    <Col style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                      <LongTextField name='description' id={COMPONENT_IDS.EDIT_CHALLENGE_DESCRIPTION} required/>
                      <TextField name='submissionDetail' id={COMPONENT_IDS.EDIT_CHALLENGE_SUBMISSION_DETAIL} required/>
                      <TextField name='pitch' id={COMPONENT_IDS.EDIT_CHALLENGE_PITCH} required/>
                    </Col>
                  </Container>
                  <div style={{ textAlign: 'center' }}>
                    <SubmitField value='Submit' id={COMPONENT_IDS.EDIT_CHALLENGE_SUBMIT}/>
                  </div>
                  <ErrorsField/>
                </Card>
              </AutoForm>
            </Col>
          </Container>
        </div>
    );
};

EditChallengeWidget.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditChallengeCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  return {
    doc: Challenges.findOne(documentId),
  };
})(EditChallengeWidget);

export default withRouter(EditChallengeCon);
