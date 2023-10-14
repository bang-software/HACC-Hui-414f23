import React, { useState } from 'react';
import {
  List, Divider,
} from 'semantic-ui-react';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as Icon from 'react-bootstrap-icons';

const ListParticipantCardAdmin = ({ participants, skills, tools, challenges, teams }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };
  const isMinor = participants.minor;
  return (
      <div>
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave} onClick={handleShow}
              style={{ padding: '0rem 1.5rem 0.5rem 1.5rem', border: 'none' }}>
          <Card.Body>
            <Card.Title>
              <h4>
                <Icon.PersonFill size={50}/>
                {participants.firstName} {participants.lastName}
                {teams.length === 0 ? (<div><Icon.SlashCircleFill color="red"/> No team </div>)
                    : ''}
                {_.uniq(teams).length > 1 ? (<div><Icon.SlashCircleFill color="red"/> Multiple teams </div>)
                    : ''}
                {isMinor ? (<div><Icon.PersonBoundingBox/>Minor</div>) : ''}
              </h4>
            </Card.Title>
            <Col>
              <h5>About Me</h5>
              {participants.aboutMe}
            </Col>
            <Divider hidden/>
            <Container>
              <Row>
                <Col>
                  <b>Challenges</b><br/>
                  <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                    {challenges.slice(0, 3).map((challenge, i) => <p
                        style={{ color: 'rgb(89, 119, 199)' }}
                        key={challenge + i}>
                      {challenge}</p>)}
                  </Col>
                </Col>
                <Col>
                  <b>Skills</b><br/>
                  {skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                    {skill.name}</p>)}
                </Col>
                <Col>
                  <b>Tools</b><br/>
                  {tools.slice(0, 3).map((tool, i) => <p key={tool + i}>
                    {tool.name}</p>)}
                </Col>
                <Col>
                  <b>Slack Username</b><br/>
                  {participants.username}
                </Col>
                <Col>
                  <b>GitHub</b><br/>
                  {participants.gitHub}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> {participants.firstName} {participants.lastName}
              <br/> {participants.demographicLevel} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col><Icon.Github/>GitHub:<br/>
                  <a href={participants.gitHub}>{participants.gitHub}</a>
                </Col>
                <Col><Icon.Server/>Website:<br/>
                  <a href={participants.website}>{participants.website}</a>
                </Col>
                <Col><Icon.Linkedin/>LinkedIn:<br/>
                  <a href={participants.linkedIn}>{participants.linkedIn}</a>
                </Col>
                <Col><Icon.Slack/>Slack Username:<br/>
                  <a href={participants.username}>{participants.username}</a>
                </Col>
              </Row>
            </Container>
            <Divider hidden/>
            <Col>
              <h6>Challenges</h6>
              <List bulleted>
                {challenges.map((challenge, i) => (
                    <List.Item key={challenge + i}>{challenge}</List.Item>
                ))}
              </List>
            </Col>
            <Divider hidden/>
            <Col>
              <h6>Skills</h6>
              <List bulleted>
                {skills.map((skill, i) => <List.Item key={skill + i}>{skill.name}</List.Item>)}
              </List>
            </Col>
            <Divider hidden/>
            <Col>
              <h6>Tools</h6>
              <List bulleted>
                {tools.map((tool, i) => <List.Item key={tool + i}>{tool.name}</List.Item>)}
              </List>
            </Col>
            <Divider hidden/>
            <Col>
              <h6>Teams</h6>
              <List bulleted>
                {_.uniq(teams).map((team, i) => <List.Item key={team + i}>{team}</List.Item>)}
              </List>
            </Col>
          </Modal.Body>
        </Modal>
      </div>
  );
};

ListParticipantCardAdmin.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};
export default ListParticipantCardAdmin;
