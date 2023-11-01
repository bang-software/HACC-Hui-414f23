import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import { Redirect, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { ROUTES } from '../../../startup/client/route-constants';

const EditSkillWidget = () => {

  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    name: String,
    description: String,
  });
  const documentId = useParams();
  const { doc } = useTracker(() => {
    const document = Skills.findOne(documentId);
    return {
      doc: document,
    };
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data) => {
    const {
      name, description,
    } = data;
    const id = documentId._id;
    const updateData = { id, name, description };
    const collectionName = Skills.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
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
  return (
      <Container>
        <Col>
          <Row className="title">
            <h2>Edit Skill</h2>
          </Row>
          <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
            <Container className={'teamCreate'}>
              <Row>
                <Col className="cardStyle">
                  <TextField name='name' id={COMPONENT_IDS.EDIT_SKILL_NAME} required/>
                  <LongTextField name='description' id={COMPONENT_IDS.EDIT_SKILL_DESCRIPTION} required/>
                  <SubmitField value='Submit' id={COMPONENT_IDS.EDIT_SKILL_SUBMIT}/>
                  <ErrorsField/>
                </Col>
              </Row>
            </Container>
          </AutoForm>
        </Col>
      </Container>
  );
};

export default EditSkillWidget;
