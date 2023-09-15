import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Container, Image, ListGroup } from 'react-bootstrap';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

const ProfileCard = ({ model }) => (
  // <Card>
  //   <Card.Body>
  //     <Card.Header>
  //       <h1>{ model.firstName} {model.lastName}</h1>
  //     </Card.Header>
  //     <Card.Subtitle>{ model.username }<br/> { model.demographicLevel }</Card.Subtitle>
  //     <Container>
  //       <Col>
  //         {model.username}
  //       </Col>
  //     </Container>
  //   </Card.Body>
  // </Card>

  <Card>
    <Card.Body>
      <Card.Header>
        <h1>{model.firstName} {model.lastName}</h1>
      </Card.Header>
      <Card.Subtitle>{ model.username }<br/> { model.demographicLevel }
      </Card.Subtitle>
      <Container>
        <Col>
          {/*<Image width='300px' src='/images/HACC_icon_2022.png' /><Icon name="github"/> GitHub:<br/>*/}
          <a href={model.gitHub}>{model.gitHub}</a>
        </Col>
        <Col>
          {/*<Icon name="linkedin"/> Linked In:<br/>*/}
          <a href={model.linkedIn}>{model.linkedIn}</a>
        </Col>
        <Col>
          {/*<Icon name="server"/> Website:<br/>*/}
          <a href={model.website}>{model.website}</a>
        </Col>
        <Col>
          {/*<Icon name="slack"/> Slack:<br/>*/}
          <a href={model.slackUsername}>{model.slackUsername}</a>
        </Col>
      </Container>
        {/*<Container container columns={1}>*/}
        {/*  <Col>*/}
        {/*    <Icon name="comment"/> About me: {model.aboutMe}*/}
        {/*  </Col>*/}
        {/*</Container>*/}
    </Card.Body>
    <Card.Body>
      <Container>
        <Row>
          <Col>
            <h4>Challenges</h4>
            <ListGroup>
              {model.challenges.map((item) => <ListGroup.Item key={item}>{item}</ListGroup.Item>)}
            </ListGroup>
          </Col>
          <Col>
            <h6>Skills</h6>
            <ListGroup>
              {model.skills.map((item) => <SkillItem item={item} key={item._id}/>)}
            </ListGroup>
          </Col>
          <Col>
            <h6>Tools</h6>
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
