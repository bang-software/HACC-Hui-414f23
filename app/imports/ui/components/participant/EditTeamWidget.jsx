import React, { useState } from 'react';
import { Container, Col, Card, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField, SelectField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import { Redirect, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import MultiSelectField from '../form-fields/MultiSelectField';
import RadioField from '../form-fields/RadioField';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';

const EditTeamWidget = () => {
  const [redirect, setRedirect] = useState(false);
  const teamID = useParams();

  const { docs } = useTracker(() => {
    const teamData = Teams.findDoc(teamID);
    const challengeIDs = TeamChallenges.find({ teamID }).fetch();
    const challengesData = _.map(challengeIDs, (doc) => Challenges.findDoc(doc.challengeID));
    const skillIDs = TeamSkills.find({ teamID }).fetch();
    const skillsData = _.map(skillIDs, (id) => Skills.findDoc(id.skillID));
    const toolIDs = TeamTools.find({ teamID }).fetch();
    const toolsData = _.map(toolIDs, (id) => Tools.findDoc(id.toolID));
    const memberIDs = TeamParticipants.find({ teamID }).fetch();
    const membersData = _.map(memberIDs, (id) => Participants.findDoc(id.participantID));
    const participantsData = Participants.find({}).fetch();
    const allChallengesData = Challenges.find({}).fetch();
    const allSkillsData = Skills.find({}).fetch();
    const allToolsData = Tools.find({}).fetch();
    const canChangeChallengesData = CanChangeChallenges.findOne().canChangeChallenges;
    return {
      team: teamData,
      skills: skillsData,
      challenges: challengesData,
      tools: toolsData,
      members: membersData,
      participants: participantsData,
      allChallenges: allChallengesData,
      allSkills: allSkillsData,
      allTools: allToolsData,
      canChangeChallenges: canChangeChallengesData,
    };
  });

  // const trackerData = useTracker(() => {
  //   const teamData = Teams.findDoc(teamID);
  //   const challengeIDs = TeamChallenges.find({ teamID }).fetch();
  //   const challengesData = _.map(challengeIDs, (doc) => Challenges.findDoc(doc.challengeID));
  //   const skillIDs = TeamSkills.find({ teamID }).fetch();
  //   const skillsData = _.map(skillIDs, (id) => Skills.findDoc(id.skillID));
  //   const toolIDs = TeamTools.find({ teamID }).fetch();
  //   const toolsData = _.map(toolIDs, (id) => Tools.findDoc(id.toolID));
  //   const memberIDs = TeamParticipants.find({ teamID }).fetch();
  //   const membersData = _.map(memberIDs, (id) => Participants.findDoc(id.participantID));
  //   const participantsData = Participants.find({}).fetch();
  //   const allChallengesData = Challenges.find({}).fetch();
  //   const allSkillsData = Skills.find({}).fetch();
  //   const allToolsData = Tools.find({}).fetch();
  //   const canChangeChallengesData = CanChangeChallenges.findOne().canChangeChallenges;
  //
  //   return {
  //     team: teamData,
  //     skills: skillsData,
  //     challenges: challengesData,
  //     tools: toolsData,
  //     members: membersData,
  //     participants: participantsData,
  //     allChallenges: allChallengesData,
  //     allSkills: allSkillsData,
  //     allTools: allToolsData,
  //     canChangeChallenges: canChangeChallengesData,
  //   };
  // });

  // Destructuring the returned data from useTracker
  // const {
  //   team,
  //   skills,
  //   challenges,
  //   tools,
  //   members,
  //   participants,
  //   allChallenges,
  //   allSkills,
  //   allTools,
  //   canChangeChallenges,
  // } = trackerData;

  const submitData = (data) => {
    // console.log('submit', data);
    const collectionName = docs.Teams.getCollectionName();
    const updateData = {};
    // description, challenges, skills, tools, image, open
    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = data.open === 'Open';
    if (data.challenge) {
      // build an array of challenge slugs
      updateData.challenges = [];
      const doc = Challenges.findDoc({ title: data.challenge });
      updateData.challenges.push(Slugs.getNameFromID(doc.slugID));
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
    if (data.image) {
      updateData.image = data.image;
    }
    if (data.members) {
      updateData.participants = data.members;
    }
    // console.log(collectionName, updateData);
    docs.updateMethod.call({ collectionName, updateData }, (error) => {
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
          text: 'Team updated.',
        });
      }
    });
    this.setState({ redirectToReferer: true });
  };

  const buildTheFormSchema = () => {
    const challengeNames = _.map(docs.allChallenges, (c) => c.title);
    const skillNames = _.map(docs.allSkills, (s) => s.name);
    const toolNames = _.map(docs.allTools, (t) => t.name);
    const participantNames = _.map(docs.participants, (p) => p.username);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String },
      challenge: { type: String, allowedValues: challengeNames, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      members: { type: Array, optional: true },
      'members.$': { type: String, allowedValues: participantNames },
      description: String,
      gitHubRepo: { type: String, optional: true },
      devPostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
    });
    return schema;
  };
  const buildTheModel = () => {
    const model = docs.team;
    // console.log(model);
    model.challenges = _.map(docs.challenges, (challenge) => challenge.title);
    model.challenge = docs.team.challenges[0];
    model.skills = _.map(docs.skills, (skill) => skill.name);
    model.tools = _.map(docs.tools, (tool) => tool.name);
    if (model.open) {
      model.open = 'Open';
    } else {
      model.open = 'Close';
    }
    model.members = _.uniq(_.map(docs.members, (m) => m.username));
    // console.log('model', model);
    return model;
  };
  const formSchema = new SimpleSchema2Bridge(buildTheFormSchema());
  const model = buildTheModel();

  if (redirect) {
    return <Redirect to={ROUTES.SOME_ROUTE} />; // Update the route accordingly
  }

  return (
      <div className="container">
      <Container>
        <Row className="h2Title">
          <h2 className='textCenter'>Edit Team</h2>
        </Row>
        <AutoForm schema={formSchema} model={model} onSubmit={data => submitData(data)}>
          <Container className={'teamEdit'}>
            <Card>
              <Card.Body className="cardStyle">
                <TextField name='name' />
                <SelectField name='challenge' disabled={!docs.canChangeChallenges} key={String(canChangeChallenges)} />
                <MultiSelectField name='skills' />
                <MultiSelectField name='tools' />
                <LongTextField name='description' />
                <TextField name="gitHubRepo" disabled />
                <TextField name="devPostPage" />
                <TextField name="affiliation" />
                <MultiSelectField name='members' />
                <SubmitField value='Submit' />
                <ErrorsField />
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Container>
      </div>
  );
};



export default EditTeamWidget;
