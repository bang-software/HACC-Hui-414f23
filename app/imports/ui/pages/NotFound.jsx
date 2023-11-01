import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../testIDs/pageIDs';

/**
 * Render a Not Found page if the user enters a URL that doesn't match any route.
 * @memberOf ui/pages
 */
const NotFound = () => (
      <Container id={PAGE_IDS.NOT_FOUND}>
        <Row className="justify-content-center">
          <Col className="text-center"><h2>
            Page not found
          </h2></Col>
        </Row>
      </Container>
  );

export default NotFound;
