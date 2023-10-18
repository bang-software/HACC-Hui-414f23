import React from 'react';
import { Col, Container, Nav, Row, Stack } from 'react-bootstrap';
import { footer } from '../styles';

/**
 * The Footer appears at the bottom of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class Footer extends React.Component {
  render() {
    return (
          <footer style={footer} className="">
            <Container>
              <Col>
                <Container>
                  <Nav className="justify-content-center">
                    <Stack>
                      <Row className="justify-content-center">
                        <Col className="text-center">Department of Information and Computer Sciences</Col>
                      </Row>
                      <Row className="justify-content-center">
                        <Col className="text-center">University of Hawaii</Col>
                      </Row>
                      <Row className="justify-content-center">
                        <Col className="text-center">Honolulu, HI 96822</Col>
                      </Row>
                      <Row className="justify-content-center">
                        <Col className="text-center"><a href="http://HACC-Hui.github.io">HACC-Hui Home Page</a></Col>
                      </Row>
                    </Stack>
                  </Nav>
                </Container>
              </Col>
            </Container>
          </footer>
    );
  }
}

export default Footer;
