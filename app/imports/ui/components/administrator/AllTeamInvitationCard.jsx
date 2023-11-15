import React from 'react';
import {
  Grid,
  Header,
  Image,
  Item,
  Modal,
  Icon,
} from 'semantic-ui-react';
import {
  Container,
  Card,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';

class AllTeamInvitationCard extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {

    function changeBackground(e) {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    }

    function onLeave(e) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }

    const teamID = Teams.findDoc({ name: this.props.teams.name })._id;
    const invitations = TeamInvitations.find({ teamID }).fetch();
    for (let i = 0; i < invitations.length; i++) {
      invitations[i] = invitations[i].participantID;
    }
    const invitedMembers = [];
    _.forEach(invitations, (id) => {
      invitedMembers.push(Participants.getFullName(id));
    });
    return (
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 2rem 1rem 2rem' }}>
          <Modal closeIcon trigger={
            <Card.Body>
              <Card.Title>
                <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
                  <Icon name='users' />
                  {this.props.teams.name}
                </h3>
              </Card.Title>
                <Container>
                  <Row doubling columns={5}>
                    <Col>
                      <Image src={this.props.teams.image} rounded size='small'/>
                      <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                        {this.props.challenges.slice(0, 3).map((challenge) => <p
                            style={{ color: 'rgb(89, 119, 199)' }}
                            key={challenge}>
                          {challenge}</p>)}
                      </Col>
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Skills</h5>
                      {this.props.skills.slice(0, 3).map((skill) => <p key={skill}>
                        {skill}</p>)}
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Tools</h5>
                      {this.props.tools.slice(0, 3).map((tool) => <p key={tool}>
                        {tool}</p>)}
                    </Col>
                    <Col>
                      <h5 style={{ fontWeight: 'bold' }}>Member(s) Invited:</h5>
                      {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                        {members}</p>)}
                    </Col>
                  </Row>
                </Container>
            </Card.Body>
          }>
            <Modal.Header>{this.props.teams.name}</Modal.Header>
            <Modal.Content image scrolling>
              <Image size='medium' src={this.props.teams.image} wrapped/>
              <Modal.Description>
                <h4>Description</h4>
                <p>
                  {this.props.teams.description}
                </p>
                <h4>Challenges</h4>
                {this.props.challenges.map((challenge) => <p key={challenge}>
                  {challenge}</p>)}
                <h4>Skills</h4>
                {this.props.skills.map((skill) => <p key={skill}>
                  {skill}</p>)}
                <h4>Tools</h4>
                {this.props.tools.map((tool) => <p key={tool}>
                  {tool}</p>)}
                <h4>Members</h4>
                {this.props.participants.map((participant) => <p key={participant}>
                  {participant.firstName} {participant.lastName}</p>)}
                <h4>Member(s) Invited:</h4>
                {invitedMembers.slice(0, 3).map((members) => <p key={members}>
                  {members}</p>)}
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Card>
    );
  }
}

AllTeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default AllTeamInvitationCard;
