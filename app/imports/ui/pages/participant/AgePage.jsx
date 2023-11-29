import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ROUTES } from '../../../startup/client/route-constants';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
const AgePage = () => (
  <div id={PAGE_IDS.AGE_PAGE} style={{ backgroundColor: '#393B44' }}>
    <div style={{ textAlign: 'center', backgroundColor: '#24252B' }}>
      <h2 style={{ padding: '5rem 10rem 5rem 10rem', color: 'white' }}>
        Before we move onto making your profile, we need to verify your age.
        <br/>
        Are you 18 or over?
        <br/>
        <Button id={COMPONENT_IDS.AGE_PAGE_YES_BUTTON} variant="secondary" as={NavLink} exact to={ROUTES.PARTICIPATION}>
          Yes, I am
        </Button>
        <br/>
        <Button id={COMPONENT_IDS.AGE_PAGE_NO_BUTTON}
                variant="secondary" as={NavLink} activeClassName="active" exact to={ROUTES.UNDERAGE_PARTICIPATION}>
          No, I am not
        </Button>
      </h2>
    </div>
  </div>
);

export default AgePage;
