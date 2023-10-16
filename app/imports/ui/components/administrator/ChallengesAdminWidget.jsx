import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ChallengesAdminWidget = ({ challenges }) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this challenge!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Challenges.getCollectionName(),
              instance: Challenges.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Challenge removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

  return (
      <tr>
        <td>{challenges.title}</td>
        <td>{challenges.description}</td>
        <td>{challenges.submissionDetail}</td>
        <td>{challenges.pitch}</td>
        <td>
          <Button variant="primary">
            <Link className='link-light'
                  to={`/edit-challenge/${challenges._id}`}
                  id={COMPONENT_IDS.EDIT_CHALLENGE_BUTTON}>Edit</Link>
          </Button>
        </td>
        <td>
          <Button variant="outline-danger" onClick={() => removeItem(challenges._id)}>
            Delete
          </Button>
        </td>
      </tr>
  );
};

/** Require a document to be passed to this component. */
ChallengesAdminWidget.propTypes = {
  challenges: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default ChallengesAdminWidget;
