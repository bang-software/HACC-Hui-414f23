import React, { useState } from 'react';
import { Card, Row, Col, Container, Button, Modal } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';

const InterestedParticipantCard = ({ teams, skills, tools, challenges, developers }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isAdded = (tID, dID) => {
    if (typeof TeamParticipants.findOne({ teamID: tID, participantID: dID }) !== 'undefined') {
      return true;
    }
    return false;
  };

  const handleClick = (tID, dID) => {
    const thisTeam = tID;
    const devID = dID;
    const definitionData = { team: thisTeam, participant: devID };
    const collectionName = TeamParticipants.getCollectionName();
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Member added successfully', 'success');
          }
        });
    const collectionName2 = WantsToJoin.getCollectionName();
    const intID = WantsToJoin.findDoc({ participantID: devID })._id;
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        console.error('Failed to remove', error);
      }
    });
  };

  const removeDev = (dID) => {
    const devID = dID;
    const collectionName2 = WantsToJoin.getCollectionName();
    const intID = WantsToJoin.findDoc({ participantID: devID })._id;
    removeItMethod.call({ collectionName: collectionName2, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Removed Interested Developer', 'success');
      }
    });
  };

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
      <>
        <Card onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Card.Body>
            <Card.Title>
              <h4 className="fw-bold" style={{ color: '#263763', paddingTop: '2rem' }}>
                <Icon.PersonFill size={48}/>
                {developers.firstName} {developers.lastName}
              </h4>
            </Card.Title>
            <Container>
              <Row>
                <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                  {challenges.map((challenge) => <p
                      style={{ color: 'rgb(89, 119, 199)' }}
                      key={challenge}>
                    {challenge}</p>)}
                </Col>
                <Col>
                  <h4 className="fw-bold">Skills</h4>
                  {skills.map((skill) => <p key={skill}>
                    {skill.name}</p>)}
                </Col>
                <Col>
                  <h4 className="fw-bold">Tools</h4>
                  {tools.map((tool) => <p key={tool}>
                    {tool.name}</p>)}
                </Col>
                <Col>
                  <h4 className="fw-bold">Slack Username</h4>
                  {developers.username}
                </Col>
                <Col>
                  <Button onClick={handleShow}>
                    More Info
                  </Button>
                </Col>
                <Col>
                  {!isAdded(teams[0]._id, developers._id) ? (
                      <Button id={teams._id} style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}
                              onClick={handleClick.bind(this, teams[0]._id, developers._id)}
                      >
                        <Icon.Plus/> Add member
                      </Button>
                  ) : (
                      <Button id={teams._id} variant="success" disabled>
                        Member already added
                      </Button>
                  )}
                </Col>
                <Col>
                  <Button id={teams._id} variant="danger" onClick={removeDev.bind(this, developers._id)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header>
            <h3 className="fw-bold"> {developers.firstName} {developers.lastName} </h3>
          </Modal.Header>
          <Modal.Body>
            <h4 className="fw-bold">About Me</h4>
            <p>
              {developers.aboutMe}
            </p>
            <h4 className="fw-bold">Slack Username</h4>
            <p>
              {developers.username}
            </p>
            <h4 className="fw-bold">LinkedIn</h4>
            <p>
              {developers.linkedIn}
            </p>
            <h4 className="fw-bold">GitHub</h4>
            <p>
              {developers.gitHub}
            </p>
            <h4 className="fw-bold">Website</h4>
            <p>
              {developers.website}
            </p>
            <h4 className="fw-bold">Challenges</h4>
            <div>
              {challenges.map((challenge) => <p key={challenge}>
                {challenge}</p>)}
            </div>
            <h4 className="fw-bold">Skills</h4>
            <div>
              {skills.map((skill) => <p key={skill}>
                {skill.name}</p>)}
            </div>
            <h4 className="fw-bold">Tools</h4>
            <div>
              {tools.map((tool) => <p key={tool}>
                {tool.name}</p>)}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!isAdded(teams[0]._id, developers._id) ? (
                <Button id={teams._id}
                        style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}
                        onClick={handleClick.bind(this, teams[0]._id, developers._id)}
                >
                  <Icon.Plus/>
                  Add member
                </Button>
            ) : (
                <Button id={teams._id}
                        style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}
                        disabled
                >
                  <Icon.Plus/>
                  Member already added
                </Button>
            )}
            <Button id={teams._id}
                    style={{ backgroundColor: 'rgb(192, 0, 0)', color: 'white' }}
                    onClick={removeDev.bind(this, developers._id)}
            >
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
};

InterestedParticipantCard.propTypes = {
  teams: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.object.isRequired,
};
export default InterestedParticipantCard;
