import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/** Renders a single row in the table. See pages/ManageHaccWidget.jsx. */
const ToolAdminWidget = ({ tool }) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this tool!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Tools.getCollectionName(),
              instance: Tools.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Tool removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

    return (
        <tr>
          <td>{tool.name}</td>
          <td>{tool.description}</td>
          <td>
            <Link className="link-light" to={`/edit-tool/${tool._id}`}
                  id={COMPONENT_IDS.EDIT_TOOL_BUTTON}>
              <Button variant="primary">
                Edit
              </Button>
            </Link>
          </td>
          <td>
            <Button id={`${COMPONENT_IDS.DELETE_TOOL_BUTTON}-${tool._id}`}
                    variant="outline-danger"
                    onClick={() => removeItem(tool._id)}>
              Delete
            </Button>
          </td>
        </tr>
    );
};

/** Require a document to be passed to this component. */
ToolAdminWidget.propTypes = {
  tool: PropTypes.object.isRequired,
};

export default ToolAdminWidget;
