import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import { Redirect, useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { ROUTES } from '../../../startup/client/route-constants';
import { Skills } from '../../../api/skill/SkillCollection';

const EditSkill = () => {
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
      <Container id={PAGE_IDS.EDIT_SKILL_PAGE}>
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

export default withAllSubscriptions(EditSkill);
