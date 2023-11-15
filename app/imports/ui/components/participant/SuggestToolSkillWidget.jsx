import React from 'react';
import { Form, Container, Card, Row, Col } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { paleBlueStyle } from '../../styles';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const SuggestToolSkillWidget = ({ participant }) => {
  const schema = new SimpleSchema({
    type: String,
    name: String,
    description: String,
  });

  const submit = (data, formRef) => {
    const collectionName = Suggestions.getCollectionName();
    const newData = {
      username: participant.username,
      name: data.name,
      type: data.type,
      description: data.description,
    };

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Thank you for your suggestion', 'success');
            formRef.reset();
          }
        });
  };

  let fRef = null;
  const model = participant;
  const formSchema = new SimpleSchema2Bridge(schema);
  const firstname = model.firstName;
  return (
      <Container style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Card style={paleBlueStyle}>
          <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Hello {firstname},What new tool or skill do you want to suggest?
          </h2>
          <Card>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Form.Group widths="equal" style={{
                paddingRight: '10px', paddingLeft: '10px',
                paddingTop: '10px', paddingBottom: '10px',
              }}>
                <Row>
                  <Col>
                    <TextField name="name" id={COMPONENT_IDS.SUGGEST_TOOL_SKILL_NAME}/>
                  </Col>
                  <Col>
                    <SelectField name="type" id={COMPONENT_IDS.SUGGEST_TOOL_SKILL_SELECT}
                                 options={[{ label: 'Tool', value: 'Tool' }, { label: 'Skill', value: 'Skill' }]}
                    />
                  </Col>
                </Row>
                <TextField name="description" id={COMPONENT_IDS.SUGGEST_TOOL_SKILL_DESCRIPTION}/>
              </Form.Group>
              <SubmitField style={{
                display: 'block',
                marginLeft: '10px', marginRight: 'auto', marginBottom: '10px',
              }} id={COMPONENT_IDS.SUGGEST_TOOL_SKILL_SUBMIT}/>
            </AutoForm>
          </Card>
        </Card>
      </Container>
  );
};

SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
