import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';
import { COMPONENT_IDS } from '../testIDs/componentIDs';
import { PAGE_IDS } from '../testIDs/pageIDs';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const location = useLocation();
  let pathname = ROUTES.LANDING;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const submit = () => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  if (Participants.isDefined(Meteor.userId())) {
    const dev = Participants.findDoc({ userID: Meteor.userId() });
    if (dev.isCompliant) {
      if (dev.editedProfile) {
        pathname = ROUTES.LANDING;
      } else {
        pathname = ROUTES.CREATE_PROFILE;
      }
    } else {
      pathname = ROUTES.AGE_CONSENT;
    }
  }

  const { from } = location.state || { from: { pathname } };

  if (redirectToReferer) {
    return <Redirect to={from} />;
  }

  return (
    <Container id={PAGE_IDS.SIGN_IN}>
      <Row className="justify-content-md-center align-items-center">
        <Col>
          <h2 className="text-center">Login to your account</h2>
          <Card style={{ padding: '20px', marginBottom: '20px' }}>
            <Form onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL}
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD}
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button style={{ marginTop: '10px' }} id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} type="submit">
                Submit
              </Button>
            </Form>
          </Card>
          {error && (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
