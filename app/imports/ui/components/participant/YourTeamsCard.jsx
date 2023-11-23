import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, TextField, ListField, ListItemField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Modal, Button, Image, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import EditTeam from './EditTeam';

const schema = new SimpleSchema({
  participants: {
    type: Array,
    min: 1,
  },
  'participants.$': {
    type: Object,
  },
  'participants.$.email': {
    type: String,
    min: 3,
  },

});

const YourTeamsCard = ({
                        team,
                        teamParticipants,
                        teamInvitation,
                       }) => {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

  const fRef = useRef(null);

  const submit = (formData) => {
    const { participants } = formData;
    const participantCollection = Participants.dumpAll().contents;
    const foundParticipants = [];
    const participantList = [];

    // get all participant email and also the ones listed in form
    for (let i = 0; i < participants.length; i++) {
      participantList.push(participants[i].email);
      for (let j = 0; j < participantCollection.length; j++) {
        if (participants[i].email === participantCollection[j].username) {
          foundParticipants.push(participants[i].email);
        }
      }
    }

    const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
    // difference should be 0 if all the inputted participants are registered via slack
    const notFoundParticipants = difference(participantList, foundParticipants);

    // if they entered duplicates
    if (new Set(participantList).size !== participantList.length) {
      swal('Error',
          'Sorry, it seems like you entered a duplicate email.\n\nPlease check again.',
          'error');
      return;
    }

    // If we cannot find a participant's email
    if (notFoundParticipants.length > 0) {
      swal('Error',
          `Sorry, we could not find participant(s): \n${notFoundParticipants.join(', ')}
          \n\nPlease double check that their emails are inputted correctly and that they 
          have registered with the HACC-HUI Slackbot.`,
          'error');
      return;
    }

    // If the participant is already in the team OR user tries to invite themselves OR there is already an invitation
    const selfUser = Participants.findDoc({ userID: Meteor.userId() }).username;
    for (let i = 0; i < participantList.length; i++) {
      const participantDoc = Participants.findDoc({ username: participantList[i] });

      if (selfUser === participantList[i]) {
        swal('Error',
            'Sorry, you can\'t invite yourself!',
            'error');
        return;
      }
      if (typeof TeamParticipants.findOne({
        teamID: team._id,
        developerID: participantDoc._id,
      }) !== 'undefined') {
        swal('Error',
            `Sorry, participant ${participantList[i]} is already in ${team.name}!`,
            'error');
        return;
      }

      // check to see if the invitation was already issued
      for (let j = 0; j < teamInvitation.length; j++) {
        if (teamInvitation[j].teamID === team._id &&
            teamInvitation[j].participantID === participantDoc._id) {
          swal('Error',
              `Sorry, an invitation to ${participantList[i]} was already issued!`,
              'error');
          return;
        }
      }
    }

    // if there are no errors, we can then add everyone
    for (let i = 0; i < participantList.length; i++) {
      // const collectionName = WantsToJoin.getCollectionName();
      const teamDoc = Teams.findDoc(team._id);
      const teamName = Slugs.getNameFromID(teamDoc.slugID);
      const participant = participantList[i];
      const definitionData = {
        team: teamName,
        participant,
      };
      const collectionName2 = TeamInvitations.getCollectionName();
      defineMethod.call({ collectionName: collectionName2, definitionData }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success',
              `You've successfully invited participant(s):\n\n ${participantList.join(', ')}
              \nto ${team.name}
              \n The participants can now look at 'Team Invitations' to accept it.`,
              'success');
        }
      });
    }
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  return (
      <Container fluid style={{ padding: '0rem 2rem 0rem 2rem' }} id={COMPONENT_IDS.YOUR_TEAMS_CARD}>
        <Row>
          <Col>
            <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
              <i className="fa fa-users fa-xs"></i> {/* Replacement for the <Icon> component */}
              {team?.name}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            GitHub: {team.gitHubRepo}<br />
            DevPost: {team?.devPostPage}
            <Image src={team.image} rounded className="img-large"/>
          </Col>
          <Col>
            <h4>Members</h4>
            {teamParticipants?.map((participant) => <p key={participant}>
              {participant.firstName} {participant.lastName}</p>)}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="link" id={COMPONENT_IDS.SEE_INTERTESTED_PARTICIPANTS}>
              <Link
                  to={`/interested-participants/${team?._id}`}>
                See interested participants
              </Link>
            </Button>
            <Button
                    style={{ backgroundColor: 'transparent', color: '#4183C4' }}
                    onClick={() => setOpen(true)}
                    id={COMPONENT_IDS.OPEN_INVITE_PARTICIPANTS}>
              Invite Participants
            </Button>
            <Modal
                show={open}
                onHide={() => setOpen(false)}
                centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Invite Participants</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <AutoForm ref={fRef} schema={formSchema} onSubmit={data => submit(data, fRef.current)}>
                  <Row style={{ paddingTop: '20px' }}>
                    <Col>
                      <h2 className="text-center">Who would you like to invite to {team?.name}?</h2>
                      <h4 className="text-center" style={{ paddingBottom: '2rem', marginTop: '0rem' }}>
                        Please make sure the email you input is the same as the ones they have used to make their Slack account.
                      </h4>
                      <ListField name="participants" label="Enter each participant's email">
                        <ListItemField name="$">
                          <TextField showInlineError
                                     icon="mail"
                                     name="email"
                                     label="Email"
                                     id={COMPONENT_IDS.INVITE_PARTICIPANTS_TEXTFIELD}
                          />
                        </ListItemField>
                      </ListField>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Button
                        type="submit"
                        variant="success"
                        style={{ margin: '20px 10px' }}
                        id={COMPONENT_IDS.INVITE_PARTICIPANTS_SUBMIT}
                    >
                      Invite
                    </Button>
                  </Row>
                </AutoForm>
              </Modal.Body>
            </Modal>
          </Col>
          <Col>
            <Button id={COMPONENT_IDS.EDIT_TEAM_BUTTON}
                    onClick={() => setSelectedTeam(team._id)}>
              Edit Team
            </Button>
            <Modal className='modal-xl modal-dialog-scrollable'
                   show={selectedTeam === team._id}
                   onHide={() => setSelectedTeam('')}>
              <Modal.Header closeButton />
              <Modal.Body>
                <EditTeam
                  teamName={team.name}
                />
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Container>
  );
};

YourTeamsCard.propTypes = {
  team: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  teamInvitation: PropTypes.array.isRequired,
};

export default YourTeamsCard;
