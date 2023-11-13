import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import {
  AutoForm, SubmitField, TextField, LongTextField,
  ListField, ListItemField, SelectField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import {Header, Icon} from "semantic-ui-react";
// import RadioField from "../form-fields/RadioField";

const CreateTeamWidget = () => {
  const { Fetchedparticipant, Fetchedchallenges, Fetchedskills, Fetchedtools, FetchedcanCreateTeams } = useTracker(() => ({
    Fetchedparticipant: Participants.findDoc({ userID: Meteor.userId() }),
    Fetchedchallenges: Challenges.find({}).fetch(),
    Fetchedskills: Skills.find({}).fetch(),
    Fetchedtools: Tools.find({}).fetch(),
    FetchedcanCreateTeams: CanCreateTeams.findOne().canCreateTeams,
  }));

  const [errorModal, setErrorModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState([]);
  const [notRegistered, setNotRegistered] = useState([]);

  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      open: {
        type: String,
        label: 'Availability',
      },
      name: { type: String, label: 'Team Name' },
      challenge: { type: String, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String },
      // participants: { type: String, label: 'participants' },
      description: String,
      devpostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
      participants: {
        optional: true,
        type: Array,
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
  const submit = (formData, formRef) => {
    setIsRegistered([]);
    setNotRegistered([]);
    const owner = Fetchedparticipant.username;
    const { name, description, challenge, skills, tools, participants, devpostPage, affiliation } = formData;
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed in the Team name.', 'error');
      return;
    }
    const partArray = participants || [];

    const currPart = Participants.find({}).fetch();

    partArray.forEach(parti => {
      const isParticipantRegistered = currPart.some(curr => curr.username === parti.email);
      if (isParticipantRegistered) {
        setIsRegistered(prev => [...prev, `-${parti.email}`]);
        isRegistered.push(parti.email);
      } else {
        setNotRegistered(prev => [...prev, `-${parti.email}`]);
        notRegistered.push(parti.email);
      }
    });

    if (notRegistered.length !== 0) {
      setErrorModal(true);
    }

    // const open = formData.open === 'Open';
    const open = formData.open === 'Open';

    const skillsArr = skills.map((n) => {
      const doc = Skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = tools.map((t) => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = challenge ? [Slugs.getNameFromID(Challenges.findDoc({ title: challenge }).slugID)] : [];

    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      challenges: challengesArr,
      skills: skillsArr,
      tools: toolsArr,
      devpostPage: devpostPage,
      affiliation: affiliation,
    };

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        if (!errorModal) {
          swal('Success', 'Team created successfully', 'success');
        }
        formRef.current.reset();
      }
    });

    // Sending invites to registered members
    isRegistered.forEach(email => {
      const newTeamID = Teams.findOne({ name: name })._id;
      const teamDoc = Teams.findDoc(newTeamID);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const inviteCollectionName = TeamInvitations.getCollectionName();
      const inviteData = { team, participant: email };

      defineMethod.call({ collectionName: inviteCollectionName, definitionData: inviteData }, (error) => {
        if (error) {
          console.error('Error sending invitation:', error.message);
        } else {
          console.log('Invitation sent successfully');
        }
      });
    });
  };
  const closeModal = () => {
    setErrorModal(false);
    swal('Success', 'Team created successfully', 'success');
  };

  const model = Fetchedparticipant;
  const schema = buildTheFormSchema();
  const formSchema = new SimpleSchema2Bridge(schema);
  let fRef = null;

  if (!Fetchedparticipant.isCompliant) {
    return (
        <Container fluid>
          <Header as='h2' icon>
            <Icon name='thumbs down outline' />
            You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
            <Header.Subheader>
              You cannot create a team until you do agree to the rules. Please check back later.
            </Header.Subheader>
          </Header>
        </Container>
    );
  }

  return (
      <Container fluid className="mt-3">
        <Row>
          <h3><b>Create Your Team</b></h3>
          <hr />
        </Row>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} model={model} onSubmit={data => submit(data, fRef)}>
          <Row>
            <Col>
              <TextField name="name" id={COMPONENT_IDS.CREATE_TEAM_NAME}/>
            </Col>
            <Col>
              <SelectField
                  name='open'
                  options={[
                    { key: 'open', label: 'Open', value: 'Open' },
                    { key: 'close', label: 'Close', value: 'Close' },
                  ]}
              />
            </Col>
            <Col>
              <LongTextField name="description" id={COMPONENT_IDS.CREATE_TEAM_DESCRIPTION}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectField name="challenge" options={Fetchedchallenges.map(c => ({ label: c.title, value: c.title }))}/>
            </Col>
            <Col>
              <SelectField name="skills" multiple options={Fetchedskills.map(s => ({ label: s.name, value: s.name }))}/>
            </Col>
            <Col>
              <SelectField name="tools" multiple options={Fetchedtools.map(t => ({ label: t.name, value: t.name }))}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextField name="devpostPage" id={COMPONENT_IDS.CREATE_TEAM_DEVPOST}/>
            </Col>
            <Col>
              <TextField name="affiliation" id={COMPONENT_IDS.CREATE_TEAM_AFFILIATION}/>
            </Col>
          </Row>
          <Row>
            <ListField name="participants" label={'Enter each participant\'s email'}>
              <ListItemField name="$">
                <TextField showInlineError
                           iconLeft='mail'
                           name="email"
                           label={'Email'} />
              </ListItemField>
            </ListField>
          </Row>
          <SubmitField id={COMPONENT_IDS.CREATE_TEAM_SUBMIT}/>
        </AutoForm>
        <Modal show={errorModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Member Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The following users are not registered: {notRegistered.join(', ')}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
};

export default CreateTeamWidget;
