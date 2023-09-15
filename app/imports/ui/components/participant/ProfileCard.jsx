import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Container, Image, ListGroup } from 'react-bootstrap';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

const ProfileCard = ({ model }) => (
  <Card>
    <Card.Body>
      <Card.Title>
        <h3><b>{model.firstName} {model.lastName}</b></h3>
      </Card.Title>
      <Card.Subtitle>{ model.username }<br/> { model.demographicLevel }<br/><br/>
      </Card.Subtitle>
      <Container>
        <Row>
          <Col>
            <Image width='20px' src='/images/github_icon.png' />{'  GitHub: '}<br/>
            <a href={model.gitHub}>{model.gitHub}</a>
          </Col>
          <Col>
            <Image width='20px' src='/images/linked_in_icon.png' />{'  Linked In: '}
            <br/>
            <a href={model.linkedIn}>{model.linkedIn}</a>
          </Col>
          <Col>
            <Image width='20px' src='/images/website_icon.png' />{'  Website: '}<br/>
            <a href={model.website}>{model.website}</a>
          </Col>
          <Col>
            <Image width='30px' src='/images/slack_icon.png' />{'  Slack: '}<br/>
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
              {model.skills.map((item) => <SkillItem item={item} key={item._id}/>)}
            </ListGroup>
          </Col>
          <Col>
            <h5><b>Tools</b></h5>
            <hr/>
            <ListGroup>
              {model.tools.map((item) => <ToolItem item={item} key={item._id}/>)}
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
