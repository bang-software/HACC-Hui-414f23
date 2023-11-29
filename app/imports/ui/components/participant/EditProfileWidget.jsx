import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, ErrorsField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
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

const EditProfileWidget = () => {
  const {
    allChallenges,
    allSkills,
    allTools,
    participant,
    devChallenges,
    devSkills,
    devTools,
  } = useTracker(() => {
    const userId = Meteor.userId();
    const part = Participants.findOne({ userID: userId });
    const participantID = part?._id;

    return {
      allChallenges: Challenges.find({}).fetch(),
      allSkills: Skills.find({}).fetch(),
      allTools: Tools.find({}).fetch(),
      participant: part,
      devChallenges: participantID ? ParticipantChallenges.find({ participantID }).fetch() : [],
      devSkills: participantID ? ParticipantSkills.find({ participantID }).fetch() : [],
      devTools: participantID ? ParticipantTools.find({ participantID }).fetch() : [],
    };
  }, []);
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const buildTheFormSchema = () => {
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
      'challenges.$': { type: String },
      skills: { type: Array, optional: true },
      'skills.$': { type: String },
      tools: { type: Array, optional: true },
      'tools.$': { type: String },
    });
    return schema;
  };

  const buildTheModel = () => {
    const model = participant;
    model.challenges = devChallenges.map((challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = devSkills.map((skill) => {
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = devTools.map((tool) => {
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
                <Card.Body>
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
                      <SelectField
                          id={COMPONENT_IDS.CREATE_PROFILE_CHALLENGES}
                          multiple
                          name="challenges"
                          options={allChallenges.map(c => ({ label: c.title, value: c.title }))}
                      />
                    </Col>
                    <Col>
                      <h6 className="fw-bold"> Skills </h6>
                      <SelectField
                          multiple
                          name="skills"
                          options={allSkills.map(s => ({ label: s.name, value: s.name }))}
                      /> </Col>
                    <Col>
                      <h6 className="fw-bold"> Tools </h6>
                      <SelectField
                        multiple
                        name="tools"
                        options={allTools.map(t => ({ label: t.name, value: t.name }))}
                    /> </Col>
                  </Row>
                  <div className="text-center">
                    <SubmitField value='Submit'
                                 style={{
                                   margin: '2rem 0rem',
                                 }}/>
                  </div>
                  <ErrorsField/>
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Container>
      </div>
  );
};
export default EditProfileWidget;
