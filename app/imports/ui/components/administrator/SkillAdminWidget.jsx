import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/** Renders a single row in the table. See pages/ManageHaccWidget.jsx. */
const SkillAdminWidget = ({ skill }) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this skill!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Skills.getCollectionName(),
              instance: Skills.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Skill removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

    return (
        <tr>
          <td>{skill.name}</td>
          <td>{skill.description}</td>
          <td>
            <Link className='link-light'
                  to={`/edit-skill/${skill._id}`}
                  id={COMPONENT_IDS.EDIT_SKILL_BUTTON}>
              <Button variant="primary">Edit</Button>
            </Link>
          </td>
          <td>
            <Button id={`${COMPONENT_IDS.DELETE_SKILL_BUTTON}-${skill._id}`}
                    variant="outline-danger"
                    onClick={() => removeItem(skill._id)}>
              Delete
            </Button>
          </td>
        </tr>
    );
};

/** Require a document to be passed to this component. */
SkillAdminWidget.propTypes = {
  skill: PropTypes.object.isRequired,
};

export default SkillAdminWidget;
