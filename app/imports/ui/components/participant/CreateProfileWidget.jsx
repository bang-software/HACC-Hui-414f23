import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm, BoolField,
  LongTextField, SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { ROUTES } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const CreateProfileWidget = ({ participant, skills, tools, challenges }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const buildTheFormSchema = () => {
    const challengeNames = challenges.map((c) => c.title);
    const skillNames = skills.map((s) => s.name);
    const toolNames = tools.map((t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
      linkedIn: { type: String, optional: true },
      gitHub: { type: String, optional: true },
      slackUsername: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
      challenges: { type: Array, optional: true },
      'challenges.$': { type: String, allowedValues: challengeNames },
      skills: { type: Array, optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
    });
    return schema;
  };

  const submit = (data) => {
    const collectionName = Participants.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.firstName = data.firstName;
    updateData.lastName = data.lastName;
    if (data.demographicLevel) {
      updateData.demographicLevel = data.demographicLevel;
    }
    if (data.challenges) {
      // build an array of challenge slugs
      updateData.challenges = data.challenges.map((title) => {
        const doc = Challenges.findDoc({ title });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.skills) {
      updateData.skills = data.skills.map((name) => {
        const doc = Skills.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.tools) {
      updateData.tools = data.tools.map((name) => {
        const doc = Tools.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.linkedIn) {
      updateData.linkedIn = data.linkedIn;
    }
    if (data.gitHub) {
      updateData.gitHub = data.gitHub;
    }
    if (data.slackUsername) {
      updateData.slackUsername = data.slackUsername;
    }
    if (data.website) {
      updateData.website = data.website;
    }
    if (data.aboutMe) {
      updateData.aboutMe = data.aboutMe;
    }
    updateData.editedProfile = true;
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have this issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Your profile is updated.',
        });
      }
    });
    setRedirectToReferer(true);
  };
    const model = participant;
    const schema = buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    if (redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from} />;
    }
    return (
        <Container fluid>
          <Row>
            <h3> <b> Hello {firstname}, this is your first time to login, so please fill out your profile </b> </h3>
            <hr/>
          </Row>
            <AutoForm schema={formSchema} model={model} onSubmit={data => submit(data) }>
              <Row>
                <Col>
                  <TextField name="username" disabled />
                </Col>
                <Col>
                  <BoolField name="isCompliant" disabled />
                  </Col>
              </Row>
              <Row>
                <Col><TextField name="firstName" /></Col>
                <Col><TextField name="lastName" /></Col>
                <Col><SelectField name="demographicLevel" /></Col>
              </Row>
              <Row>
                <Col> <TextField id={COMPONENT_IDS.CREATE_PROFILE_LINKEDIN} name="linkedIn" /> </Col>
                <Col> <TextField name="gitHub" /> </Col>
                <Col> <TextField name="slackUsername" /> </Col>
              </Row>
              <Row>
                <Col> <TextField name="website" /> </Col>
                <Col> <LongTextField id={COMPONENT_IDS.CREATE_PROFILE_ABOUTME} name="aboutMe" /> </Col>
              </Row>
              <Row>
              <MultiSelectField id={COMPONENT_IDS.CREATE_PROFILE_CHALLENGES} name="challenges" />
              </Row>
              <Row>
                <Col> <MultiSelectField name="skills" /> </Col>
                <Col> <MultiSelectField name="tools" /> </Col>
              </Row>
              <SubmitField id={COMPONENT_IDS.CREATE_PROFILE_SUBMIT}/>
            </AutoForm>
        </Container>
    );
};

CreateProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  challenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  tools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const challenges = Challenges.find({}).fetch();
  const skills = Skills.find({}).fetch();
  const tools = Tools.find({}).fetch();
  return {
    participant,
    challenges,
    skills,
    tools,
  };
})(CreateProfileWidget);
