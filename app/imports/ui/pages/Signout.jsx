import React from 'react';
import { Meteor } from 'meteor/meteor';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
        <div className="text-center my-4">
          <h2>You are signed out.</h2>
        </div>
    );
  }
}

export default Signout;
