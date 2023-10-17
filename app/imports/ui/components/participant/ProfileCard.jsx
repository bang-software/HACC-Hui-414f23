import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Container, ListGroup } from 'react-bootstrap';
import { Github, Linkedin, Globe2, Slack } from 'react-bootstrap-icons';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

const ProfileCard = ({ model }) => (
  <Card id={'profile-card'}>
    <Card.Body>
      <Card.Title>
        <h3><b>{model.firstName} {model.lastName}</b></h3>
      </Card.Title>
      <Card.Subtitle>{ model.username }<br/> { model.demographicLevel }<br/><br/>
      </Card.Subtitle>
      <Container>
        <Row>
          <Col>
            <Github color="royalblue" size={30}/>{'  GitHub: '}<br/>
            <a href={model.gitHub}>{model.gitHub}</a>
          </Col>
          <Col>
            <Linkedin color="royalblue" size={30}/>{'  Linked In: '}
            <br/>
            <a href={model.linkedIn}>{model.linkedIn}</a>
          </Col>
          <Col>
            <Globe2 color="royalblue" size={30}/>{'  Website: '}<br/>
            <a href={model.website}>{model.website}</a>
          </Col>
          <Col>
            <Slack color="royalblue" size={30}/>{'  Slack: '}<br/>
            <a href={model.slackUsername}>{model.slackUsername}</a>
          </Col>
        </Row>
      </Container>
      <br/>
      <Container>
        <Col>
          <h5><b>{'About me: '}</b></h5><p>{model.aboutMe}</p>
          <hr/>
        </Col>
      </Container>
    </Card.Body>
    <Card.Body>
      <Container>
        <Row>
          <Col>
            <h5><b>Challenges</b></h5>
            <hr/>
            <ListGroup>
              {model.challenges.map((item) => <ListGroup.Item key={item}>{item}</ListGroup.Item>)}
            </ListGroup>
          </Col>
          <Col>
            <h5><b>Skills</b></h5>
            <hr/>
            <ListGroup>
              {model.skills.map((item) => <SkillItem item={item} key={item}/>)}
            </ListGroup>
          </Col>
          <Col>
            <h5><b>Tools</b></h5>
            <hr/>
            <ListGroup>
              {model.tools.map((item) => <ToolItem item={item} key={item}/>)}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Card.Body>
  </Card>
);

ProfileCard.propTypes = {
  model: PropTypes.object.isRequired,
};

export default ProfileCard;
