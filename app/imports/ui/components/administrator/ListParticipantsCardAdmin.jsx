import React, { useState } from 'react';
import { Container, Row, Col, Modal, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-bootstrap-icons';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const ListParticipantCardAdmin = ({ participant, skills, tools, challenges, teams }) => {
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
  const isMinor = participant.minor;
  return (
      <div id={COMPONENT_IDS.LIST_PARTICIPANTS_CARD_ADMIN}>
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave} onClick={handleShow}
              style={{ padding: '0rem 1.5rem 0.5rem 1.5rem', border: 'none' }}>
          <Card.Body>
            <Card.Title>
              <h4 style={{ color: '#263763', paddingTop: '1.5rem' }}>
                <Icon.PersonFill size={30}/>
                {participant.firstName} {participant.lastName}
                {teams.length === 0 ? (<div className="text-muted"> <Icon.SlashCircleFill color="red"/> No team </div>)
                    : ''}
                {new Set(teams).size > 1 ? (<div><Icon.SlashCircleFill color="red"/> Multiple teams </div>)
                    : ''}
                {isMinor ? (<div><Icon.PersonBoundingBox/>Minor</div>) : ''}
              </h4>
            </Card.Title>
            <Col>
              <h5>About Me</h5>
              {participant.aboutMe}
            </Col>
            <hr/>
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
                  {participant.username}
                </Col>
                <Col>
                  <b>GitHub</b><br/>
                  {participant.gitHub}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> {participant.firstName} {participant.lastName}
              <br/> {participant.demographicLevel} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col><Icon.Github/>GitHub:<br/>
                  <a href={participant.gitHub}>{participant.gitHub}</a>
                </Col>
                <Col><Icon.Server/>Website:<br/>
                  <a href={participant.website}>{participant.website}</a>
                </Col>
                <Col><Icon.Linkedin/>LinkedIn:<br/>
                  <a href={participant.linkedIn}>{participant.linkedIn}</a>
                </Col>
                <Col><Icon.Slack/>Slack Username:<br/>
                  <a href={participant.username}>{participant.username}</a>
                </Col>
              </Row>
            </Container>
            <Col>
              <h6>Challenges</h6>
              <hr/>
              <ul>
                {challenges.map((challenge, i) => (
                    <li key={challenge + i}>{challenge}</li>
                ))}
              </ul>
            </Col>
            <Col>
              <h6>Skills</h6>
              <hr/>
              <ul>
                {skills.map((skill, i) => <li key={skill + i}>{skill.name}</li>)}
              </ul>
            </Col>
            <Col>
              <h6>Tools</h6>
              <hr/>
              <ul>
                {tools.map((tool, i) => <li key={tool + i}>{tool.name}</li>)}
              </ul>
            </Col>
            <Col>
              <h6>Teams</h6>
              <hr/>
              <ul>
                {Array.from(new Set(teams)).map((team, i) => <li key={team + i}>{team}</li>)}
              </ul>
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
  participant: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};
export default ListParticipantCardAdmin;
