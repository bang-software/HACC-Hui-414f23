import React from 'react';
import { Container, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  name: String,
  description: String,
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddTool = () => {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { name, description } = data;
    const definitionData = { name, description };
    const collectionName = Tools.getCollectionName();
    // console.log(collectionName);
    defineMethod.call({ collectionName, definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
            console.error(error.message);
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
            // console.log('Success');
          }
        });
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  let fRef = null;
  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return (
        <Container fluid id={PAGE_IDS.ADD_TOOL}>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Add a Tool</h2>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Card style={{ padding: '20px', marginBottom: '20px' }}>
                <TextField id={COMPONENT_IDS.ADD_TOOL_NAME} name='name' />
                <TextField id={COMPONENT_IDS.ADD_TOOL_DESCRIPTION} name='description' />
                <SubmitField value='Submit' />
                <ErrorsField />
              </Card>
            </AutoForm>
          </Col>
        </Container>
    );
};

export default AddTool;
