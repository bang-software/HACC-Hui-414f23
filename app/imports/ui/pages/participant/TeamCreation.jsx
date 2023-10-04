import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-bootstrap4';
import { Form, Container, Row, Col, Spinner, Button, FormGroup, Label, Input } from 'reactstrap';

// ... [Keep the schema definition and other imports as they are]

const TeamCreation = () => {
  const fRef = useRef(null);

  const { challenges, skills, tools, participants, ready } = useTracker(() => {
    const subscriptionChallenges = Challenges.subscribe();
    const subscriptionSkills = Skills.subscribe();
    const subscriptionTools = Tools.subscribe();
    const subscriptionParticipants = Participants.subscribe();

    return {
      challenges: Challenges.find({}).fetch(),
      skills: Skills.find({}).fetch(),
      tools: Tools.find({}).fetch(),
      participants: Participants.find({}).fetch(),
      ready: subscriptionChallenges.ready() && subscriptionSkills.ready() &&
        subscriptionTools.ready() && subscriptionParticipants.ready(),
    };
  });

  const submit = (formData) => {
    const skillsArr = this.props.skills;
    const skillsObj = [];

    const toolsArr = this.props.tools;
    const toolsObj = [];

    const challengesArr = this.props.challenges;
    const challengesObj = [];

    const owner = Participants.findDoc({ userID: Meteor.userId() }).username;

    const {
      name, description, challenges, skills, tools, image,
    } = formData;
    let { open } = formData;
    // console.log(challenges, skills, tools, open);
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
      // console.log('FALSE');
    }

    for (let i = 0; i < skillsArr.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArr[i].name === skills[j]) {
          skillsObj.push(Slugs.getNameFromID(skillsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < toolsArr.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArr[i].name === tools[j]) {
          toolsObj.push(Slugs.getNameFromID(toolsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < challengesArr.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArr[i].title === challenges[j]) {
          challengesObj.push(Slugs.getNameFromID(challengesArr[i].slugID));
        }
      }
    }

    // If the name has special character or space, throw a swal error and return early.
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed.', 'error');
      return;
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      image,
      challenges: challengesObj,
      skills: skillsObj,
      tools: toolsObj,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call({
        collectionName,
        definitionData,
      },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
          // console.error(error.message);
        } else {
          swal('Success', 'Team created successfully', 'success');
          formRef.reset();
          //   console.log('Success');
        }
      });
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  const challengeArr = challenges.map(challenge => challenge.title);
  const skillArr = skills.map(skill => skill.name);
  const toolArr = tools.map(tool => tool.name);

  if (!ready) {
    return <Spinner color="primary" />;
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <h2 className="text-center">Team Information</h2>
          <AutoForm ref={fRef} schema={formSchema} onSubmit={submit}>
            <FormGroup>
              <TextField name='name' />
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="open" value="Open" />{' '}
                  Open
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="open" value="Close" />{' '}
                  Close
                </Label>
              </FormGroup>
            </FormGroup>
            <TextField name='image' placeholder={'Team Image URL'} />
            <LongTextField name='description' />
            <FormGroup>
              <MultiSelectField name='challenges' placeholder={'Challenges'} allowedValues={challengeArr} required />
              <MultiSelectField name='skills' placeholder={'Skills'} allowedValues={skillArr} required />
              <MultiSelectField name='tools' placeholder={'Toolsets'} allowedValues={toolArr} required />
            </FormGroup>
            <TextField name="github" />
            <TextField name="devpostPage" />
            <Button type="submit" color="primary">Submit</Button>
            <ErrorsField />
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

TeamCreation.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default TeamCreation;
