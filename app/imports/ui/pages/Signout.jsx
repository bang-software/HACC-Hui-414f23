import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container } from 'react-bootstrap';
import { PAGE_IDS } from '../testIDs/pageIDs';
/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
const Signout = () => {
    Meteor.logout();
    return (
        <Container id={PAGE_IDS.SIGN_OUT} className="text-center my-4">
            <h2>You are signed out.</h2>
        </Container>
    );
};

export default Signout;
