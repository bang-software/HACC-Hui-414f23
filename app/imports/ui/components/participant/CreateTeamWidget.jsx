import React from 'react';
// eslint-disable-next-line max-len
import { AutoForm, ErrorsField, ListField, ListItemField, LongTextField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { HandThumbsDownFill } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';

const CreateTeamWidget = () => {

  const { participant, skillsCol, challenges, toolsCol, canCreateTeams } = useTracker(() => {
    const sub1 = CanCreateTeams.subscribe();
    const sub2 = Participants.subscribe();
    const sub3 = Tools.subscribe();
    const sub4 = Challenges.subscribe();
    const sub5 = Skills.subscribe();
    const rdy = sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready();
    return {
      ready: rdy,
      participant: Participants.findDoc({ userID: Meteor.userId() }),
      challenges: Challenges.find({}).fetch(),
      skillsCol: Skills.find({}).fetch(),
      toolsCol: Tools.find({}).fetch(),
      canCreateTeams: CanCreateTeams.findOne().canCreateTeams,
    };
  });

  const buildTheFormSchema = () => {
    const challengeNames = _.map(challenges, c => c.title);
    const skillNames = _.map(skillsCol, s => s.name);
    const toolNames = _.map(toolsCol, t => t.name);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String, label: 'Team Name' },
      challenge: { type: String, allowedValues: challengeNames, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      // participants: { type: String, label: 'participants' },
      description: String,
      devpostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },

      participants: {
        optional: true,
        type: Array,
        minCount: 0,
      },
      'participants.$': {
        optional: true,
        type: Object,
      },
      'participants.$.email': {
        optional: true,
        type: String,
        min: 3,
      },
    });
    return schema;
  };

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (formData, formRef) => {
    const owner = participant.username;
    const { name, description, challenge, skills, tools, participants } = formData;
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed in the Team name.', 'error');
      return;
    }
    let partArray = [];

    if (typeof (participants) !== 'undefined') {
      partArray = participants;
    }

    const currPart = Participants.find({}).fetch();
    const isRegistered = [];
    const notRegistered = [];
    for (let i = 0; i < partArray.length; i++) {
      let registered = false;
      for (let j = 0; j < currPart.length; j++) {
        if (currPart[j].username === partArray[i].email) {
          registered = true;
          isRegistered.push(partArray[i].email);
        }
      }
      if (!registered) {
        notRegistered.push(partArray[i].email);
      }
    }
    if (notRegistered.length !== 0) {
      // this.setState({ errorModal: true });
    }

    let { open } = formData;
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
    }

    const skillsArr = _.map(skills, n => {
      const doc = skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = _.map(tools, t => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = [];
    if (challenge) {
      const challengeDoc = Challenges.findDoc({ title: challenge });
      const challengeSlug = Slugs.getNameFromID(challengeDoc.slugID);
      challengesArr.push(challengeSlug);
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      challenges: challengesArr,
      skills: skillsArr,
      tools: toolsArr,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call(
        {
          collectionName,
          definitionData,
        },
        error => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            // if (!this.state.errorModal) {
              swal('Success', 'Team created successfully', 'success');
            formRef.reset();
          }
        },
    );

    // sending invites out to registered members
    for (let i = 0; i < isRegistered.length; i++) {
      const newTeamID = Teams.find({ name: name }).fetch();
      const teamDoc = Teams.findDoc(newTeamID[0]._id);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const inviteCollection = TeamInvitations.getCollectionName();
      const inviteData = { team: team, participant: isRegistered[i] };
      defineMethod.call({ collectionName: inviteCollection, definitionData: inviteData },
          (error) => {
            if (error) {
              console.error(error.message);
            } else {
              console.log('Success');
            }
          });
    }
  };

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(buildTheFormSchema);
  const model = { skills: [], tools: [] };
  const disabled = !canCreateTeams;
  return (!participant.isCompliant ? (
          <Container align={'center'}>
            <h2>
              <HandThumbsDownFill/>
              You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
              &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
            </h2>
            <h3>
              You cannot create a team until you do agree to the rules. Please check back later.
            </h3>
          </Container>
      ) : (
          <Card>
            <Col>
              <Card.Title style={{ backgroundColor: '#E5F0FE' }} className={'createTeam'}>
                Create a Team
              </Card.Title>
              <Card.Body>
                Team name and Devpost page ALL
                have to use the same name. Team names cannot have spaces or special characters.
              </Card.Body>
              <AutoForm
                  ref={ref => { fRef = ref; }}
                  schema={formSchema}
                  model={model}
                  onSubmit={data => submit(data, fRef)}
                  style={{
                    paddingBottom: '40px',
                  }}
              >
                <Row style={{ paddingTop: '20px' }}>
                  <Col style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <TextField name='name'/>
                    <RadioField
                        name='open'
                        inline
                    />
                    <LongTextField name='description'/>
                    <SelectField name='challenge'/>
                    <Row>
                      <Col><MultiSelectField name='skills'/></Col>
                      <Col><MultiSelectField name='tools'/></Col>
                    </Row>
                    <TextField name="devpostPage"/>
                    <TextField name="affiliation"/>

                    <ListField name="participants" label={'Enter each participant\'s email'}>
                      <ListItemField name="$">
                        <TextField showInlineError
                                   iconLeft='mail'
                                   name="email"
                                   label={'Email'}/>
                      </ListItemField>
                    </ListField>

                  </Col>
                </Row>
                <Container align='center'>
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#dd000a',
                                 margin: '20px 0px',
                               }}
                               disabled={disabled}
                  />
                </Container>
                <ErrorsField/>
              </AutoForm>
            </Col>
          </Card>
      )
  );
};

export default CreateTeamWidget;
