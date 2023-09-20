import React from 'react';
import { Form, Container, Card } from 'react-bootstrap';
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

const schema = new SimpleSchema({
  type: { type: String, allowedValues: ['Tool', 'Skill'], optional: false },
  name: String,
  description: String,
});

class SuggestToolSkillWidget extends React.Component {
  submit(data, formRef) {
    // console.log('CreateProfileWidget.submit', data);
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = this.props.participant;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Thank you for your suggestion', 'success');
            formRef.reset();
          }
        });
  }

  render() {
    let fRef = null;
    const model = this.props.participant;
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    return (
        <Container style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Card style = { paleBlueStyle }>
          {/* eslint-disable-next-line max-len */}
          <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hello {firstname}, please fill out the form to
            suggest a new tool or skill. </h2>
          <Card fluid>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
            <Form.Group widths="equal" style={{ paddingRight: '10px', paddingLeft: '10px',
              paddingTop: '10px', paddingBottom: '10px' }}>
              <SelectField name="type" />
              <TextField name="name" />
              <TextField name="description" />
            </Form.Group>
            <SubmitField style={{
  display: 'block',
  marginLeft: '10px', marginRight: 'auto', marginBottom: '10px',
}}/>
          </AutoForm>
          </Card>
        </Card>
        </Container>
    );
  }
}

SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
