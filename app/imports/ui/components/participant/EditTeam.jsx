import React from 'react';
import { Modal, Grid, Segment, Header, Divider, Icon, Message, Button, List } from 'semantic-ui-react';
// import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-bootstrap5';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
  SelectField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { useTracker } from 'meteor/react-meteor-data';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const EditTeam = ({ team }) => {

  const { challenges, skills, tools, members, allChallengeNames, allSkillNames, allToolNames, allParticipantNames, ready } = useTracker(() => {
    const sub1 = Challenges.subscribe();
    const sub2 = Skills.subscribe();
    const sub3 = Tools.subscribe();
    const sub4 = Participants.subscribe();
    const sub5 = TeamChallenges.subscribe();
    const sub6 = TeamSkills.subscribe();
    const sub7 = TeamTools.subscribe();
    const sub8 = TeamParticipants.subscribe();


    const challengeIDs = TeamChallenges.find({ teamID: team._id }).fetch().map((tc) => tc.challengeID);
    const skillIDs = TeamSkills.find({ teamID: team._id }).fetch().map((ts) => ts.skillID);
    const toolIDs = TeamTools.find({ teamID: team._id }).fetch().map((tt) => tt.toolID);
    const memberIDs = TeamParticipants.find({ teamID: team._id }).fetch().map((tp) => tp.participantID);
    const challenges2 = challengeIDs.map((challengeID) => Challenges.findDoc(challengeID));
    const skills2 = skillIDs.map((skillID) => Skills.findDoc(skillID));
    const tools2 = toolIDs.map((toolID) => Tools.findDoc(toolID));
    const members2 = memberIDs.map((memberID) => Participants.findDoc(memberID));
    const allChallengeNames2 = Challenges.find().fetch().map((c) => c.title);
    const allSkillNames2 = Skills.find().fetch().map((s) => s.name);
    const allToolNames2 = Tools.find().fetch().map((t) => t.name);
    const allParticipantNames2 = Participants.find().fetch().map((p) => p.username);
    const ready2 = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() &&
      sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready();
    return {
      challenges: challenges2,
      skills: skills2,
      tools: tools2,
      members: members2,
      allChallengeNames: allChallengeNames2,
      allSkillNames: allSkillNames2,
      allToolNames: allToolNames2,
      allParticipantNames: allParticipantNames2,
      ready: ready2,
    };
  });

  function buildFormSchema() {
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String },
      challenge: { type: String, allowedValues: allChallengeNames, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: allSkillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: allToolNames },
      members: { type: Array, optional: true },
      'members.$': { type: String, allowedValues: allParticipantNames },
      description: String,
      gitHubRepo: { type: String, optional: true },
      devPostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
    });
    return schema;
  }

  function buildModel() {
    const model = team;
    model.challenges = challenges.map((c) => c.title);
    model.challenge = challenges[0];
    model.skills = skills.map((s) => s.name);
    model.tools = tools.map((t) => t.name);
    model.members = members.map((m) => m.username);
    if (model.open) {
      model.open = 'Open';
    } else {
      model.open = 'Close';
    }
    return model;
  }

  function submit(data) {
    const collectionName = Teams.getCollectionName();
    const updateData = {};

    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = data.open === 'Open';
    if (data.challenges) {
      updateData.challenges = data.challenges.map((title) => Challenges.findDoc({ title })._id);
    }
    if (data.skills) {
      updateData.skills = data.skills.map((name) => Skills.findDoc({ name })._id);
    }
    if (data.tools) {
      updateData.tools = data.tools.map((name) => Tools.findDoc({ name })._id);
    }
    if (data.image) {
      updateData.image = data.image;
    }
    if (data.members) {
      updateData.participants = data.members.map((username) => Participants.findDoc({ username })._id);
    }
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
          text: 'Team updated.',
        });
      }
    });
  }

  const formSchema = new SimpleSchema2Bridge(buildFormSchema());
  const model = buildModel();

  return (
    <Grid container centered style={{ paddingBottom: '50px', paddingTop: '40px' }}>
      <Grid.Column>
        <Divider hidden/>
        <Segment
          style={{
            // borderRadius: '10px',
            backgroundColor: '#E5F0FE',
          }} className={'createTeam'}>
          <Header as="h2" textAlign="center">Create a Team</Header>
          {/* eslint-disable-next-line max-len */}
          <Message>
            <Header as="h4" textAlign="center">Team name and Devpost page ALL
              have to use the same name. Team names cannot have spaces or special characters.</Header>
          </Message>
          <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={model}>
            <Segment style={{
              borderRadius: '10px',
              backgroundColor: '#E5F0FE',
            }} className={'createTeam'}>
              <Grid columns={1} style={{ paddingTop: '20px' }}>
                <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                  <Header as="h2" textAlign="center">Edit Team</Header>
                  <Message>
                    <Header as="h4" textAlign="center">Team name and Devpost page ALL
                      have to use the same name</Header>
                  </Message>
                  <Grid className='doubleLine'>
                    <TextField name='name' />
                    <RadioField
                      name='open'
                      inline
                    />
                  </Grid>
                  <LongTextField name='description' />
                  <Grid columns={2}>
                    <Grid.Column><MultiSelectField name='skills' /></Grid.Column>
                    <Grid.Column><MultiSelectField name='tools' /></Grid.Column>
                  </Grid>
                  <TextField name="gitHubRepo" label="GitHub Repo" disabled />
                  <TextField name="devPostPage" label="Devpost Page" />
                  <TextField name="affiliation" />
                  <MultiSelectField name='members' />
                </Grid.Column>
              </Grid>
              <div align='center'>
                <SubmitField value='Submit'
                             style={{
                               color: 'white', backgroundColor: '#dd000a',
                               margin: '20px 0px',
                             }} />
              </div>
              <ErrorsField />
            </Segment>
          </AutoForm>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

EditTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default EditTeam;
