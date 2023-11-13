import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField, BoolField, SelectField } from 'uniforms-bootstrap5';
import { Redirect, useParams } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';

import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { ROUTES } from '../../../startup/client/route-constants';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';

const AdminEditTeamPage = () => {
  const [redirect, setRedirect] = useState(false);
  const {
    challenges,
    skills,
    tools,
    members,
    team,
    allChallengeNames,
    allSkillNames,
    allToolNames,
    memberNames,
    ready,
  } = useTracker(() => {
    const sub1 = Challenges.subscribe();
    const sub2 = Skills.subscribe();
    const sub3 = Tools.subscribe();
    const sub4 = Participants.subscribe();
    const sub5 = TeamChallenges.subscribe();
    const sub6 = TeamSkills.subscribe();
    const sub7 = TeamTools.subscribe();
    const sub8 = TeamParticipants.subscribe();
    const sub9 = Slugs.subscribe();
    const team2 = Teams.findDoc(useParams());
    const challengeIDs = TeamChallenges.find({ teamID: team2._id }).fetch().map((tc) => tc.challengeID);
    const skillIDs = TeamSkills.find({ teamID: team2._id }).fetch().map((ts) => ts.skillID);
    const toolIDs = TeamTools.find({ teamID: team2._id }).fetch().map((tt) => tt.toolID);
    const memberIDs = TeamParticipants.find({ teamID: team2._id }).fetch().map((tp) => tp.participantID);
    const challenges2 = challengeIDs.map((challengeID) => Challenges.findDoc(challengeID));
    const skills2 = skillIDs.map((skillID) => Skills.findDoc(skillID));
    const tools2 = toolIDs.map((toolID) => Tools.findDoc(toolID));
    const members2 = memberIDs.map((memberID) => Participants.findDoc(memberID));
    const allChallengeNames2 = Challenges.find().fetch().map((c) => c.title);
    const allSkillNames2 = Skills.find().fetch().map((s) => s.name);
    const allToolNames2 = Tools.find().fetch().map((t) => t.name);
    const memberNames2 = members2.map((member) => member.username);
    const ready2 = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() &&
        sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready();
    return {
      challenges: challenges2,
      skills: skills2,
      tools: tools2,
      members: members2,
      allChallengeNames: allChallengeNames2,
      allSkillNames: allSkillNames2,
      allToolNames: allToolNames2,
      memberNames: memberNames2,
      ready: ready2,
      team: team2,
    };
  });
  const schema = new SimpleSchema({
    open: { type: Boolean },
    name: { type: String },
    challenges: { type: Array, optional: true },
    'challenges.$': { type: String },
    skills: { type: Array, label: 'Skills', optional: true },
    'skills.$': { type: String },
    tools: { type: Array, label: 'Toolsets', optional: true },
    'tools.$': { type: String },
    members: { type: Array, optional: true },
    'members.$': { type: String },
    description: String,
    gitHubRepo: { type: String, optional: true },
    devPostPage: { type: String, optional: true },
    affiliation: { type: String, optional: true },
  });

  function buildModel() {
    const model = team;
    model.challenges = challenges.map((c) => c.title);
    model.challenge = challenges[0];
    model.skills = skills.map((s) => s.name);
    model.tools = tools.map((t) => t.name);
    model.members = members.map((m) => m.username);
    return model;
  }

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  function submit(data) {
    const collectionName = Teams.getCollectionName();
    const updateData = {};

    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = data.open;
    updateData.challenges = data.challenges.map((title) => Challenges.findDoc({ title })._id);
    updateData.skills = data.skills.map((name) => Skills.findDoc({ name })._id);
    updateData.tools = data.tools.map((name) => Tools.findDoc({ name })._id);
    updateData.image = data.image;
    updateData.participants = data.members.map((username) => Participants.findDoc({ username })._id);
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
        setRedirect(true);
      }
    });
  }

  if (redirect) {
    return <Redirect to={ROUTES.VIEW_TEAMS}/>;
  }

  const formSchema = new SimpleSchema2Bridge(schema);
  const model = buildModel();

  return (
      <Container>
        <AutoForm id={COMPONENT_IDS.EDIT_TEAM} schema={formSchema} onSubmit={data => submit(data)} model={model}>
          <Container style={{
            borderRadius: '40px',
            backgroundColor: '#E5F0FE',
          }} className={'editTeam'}>
            <Col>
              <h2 style={{ textAlign: 'center', paddingTop: '20px' }}>Edit Team</h2>
              <Card>
                <h4 style={{ textAlign: 'center', backgroundColor: '#F8F8F9', paddingTop: '10px', paddingBottom: '10px' }}>
                  Team name and Devpost page have to use the same name
                </h4>
              </Card>
            </Col>
            <Row>
              <Col>
                <TextField name='name'/>
              </Col>
              <Col>
                <BoolField
                    name='open'
                    label='Open'
                    appearance='toggle' // Renders a material-ui Toggle
                    style={{ paddingTop: '30px' }}
                />
              </Col>
            </Row>
            <LongTextField name='description'/>
            <Row>
              <Col>
                <SelectField
                    multiple
                    name="challenges"
                    options={allChallengeNames.map(name => ({ label: name, value: name }))}
                />
              </Col>
              <Col>
                <SelectField
                    multiple
                    name="skills"
                    options={allSkillNames.map(name => ({ label: name, value: name }))}
                />
              </Col>
              <Col>
                <SelectField
                    multiple
                    name="tools"
                    options={allToolNames.map(name => ({ label: name, value: name }))}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField name="gitHubRepo" label="GitHub Repo"/>
              </Col>
              <Col>
                <TextField name="devPostPage" label="Devpost Page"/>
              </Col>
              <Col>
                <TextField name="affiliation"/>
              </Col>
            </Row>
            <SelectField
                multiple
                name="members"
                options={memberNames.map(name => ({ label: name, value: name }))}
            />
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Container>
        </AutoForm>
      </Container>
  );
};

export default withAllSubscriptions(AdminEditTeamPage);
