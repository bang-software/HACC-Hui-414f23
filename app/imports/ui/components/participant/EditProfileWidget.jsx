import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { demographicLevels } from '../../../api/level/Levels';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const EditProfileWidget = ({ allChallenges, allSkills, allTools, participant, devChallenges, devSkills, devTools }) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const buildTheFormSchema = () => {
    const challengeNames = _.map(allChallenges, (c) => c.title);
    const skillNames = _.map(allSkills, (s) => s.name);
    const toolNames = _.map(allTools, (t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String, optional: true },
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

  const buildTheModel = () => {
    const model = participant;
    model.challenges = _.map(devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = _.map(devSkills, (skill) => {
      // console.log(skill);
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = _.map(devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    return model;
  };

  const submitData = (data) => {
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

  if (redirectToReferer) {
    const from = { pathname: ROUTES.YOUR_PROFILE };
    return <Redirect to={from}/>;
  }
  const model = buildTheModel();
  const schema = buildTheFormSchema();
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
      <div style={{ paddingBottom: '50px' }}>
        <Container>
          <Col>
            <div style={{
              backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <h3 className="text-center">Edit Profile</h3>
            </div>
            <AutoForm schema={formSchema} model={model} onSubmit={data => {
              submitData(data);
            }}>
              <Card style={{
                borderRadius: '1rem',
                backgroundColor: '#E5F0FE',
              }}>
                <Row>
                  <Col>
                    <TextField name="username" disabled/>
                  </Col>
                  <Col>
                    <BoolField name="isCompliant" disabled/>
                  </Col>
                </Row>
                <Row>
                  <Col><TextField name="firstName"/></Col>
                  <Col><TextField name="lastName"/></Col>
                  <Col><SelectField name="demographicLevel" options={demographicLevels}/></Col>
                </Row>
                <Row>
                  <Col><TextField name="linkedIn"/></Col>
                  <Col><TextField name="gitHub"/></Col>
                  <Col><TextField name="slackUsername"/></Col>
                </Row>
                <Row>
                  <Col><TextField name="website"/></Col>
                  <Col><LongTextField name="aboutMe"/></Col>
                </Row>
                <Row>
                  <Col>
                    <h6 className="fw-bold"> Challenges </h6>
                    <Select
                        id={COMPONENT_IDS.CREATE_PROFILE_CHALLENGES}
                        isMulti
                        name="challenges"
                        options={allChallenges.map(c => ({ label: c.title, value: c.title }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                  </Col>
                  <Col>
                    <h6 className="fw-bold"> Skills </h6>
                    <Select
                        isMulti
                        name="Skills"
                        options={allSkills.map(s => ({ label: s.name, value: s.name }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    /> </Col>
                  <Col>
                    <h6 className="fw-bold"> Tools </h6><Select
                      isMulti
                      name="Tools"
                      options={allTools.map(t => ({ label: t.name, value: t.name }))}
                      className="basic-multi-select"
                      classNamePrefix="select"
                  /> </Col>
                </Row>
                <div className="text-center">
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#DB2828',
                                 margin: '2rem 0rem',
                               }}/>
                </div>
                <ErrorsField/>
              </Card>
            </AutoForm>
          </Col>
        </Container>
      </div>
  );
};

EditProfileWidget.propTypes = {
  allChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

export default withTracker(() => {
  const allChallenges = Challenges.find({}).fetch();
  const allSkills = Skills.find({}).fetch();
  const allTools = Tools.find({}).fetch();
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    allChallenges,
    allSkills,
    allTools,
    participant,
    devChallenges,
    devSkills,
    devTools,
  };
})(EditProfileWidget);
