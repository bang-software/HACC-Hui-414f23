import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
/**
 * @type {function({buttonLabel: *, description: *, deleteFunction: *})}
 */
// eslint-disable-next-line react/prop-types
const DeleteConfirmation = ({ buttonLabel, description, deleteFunction }) => {

  const [showConfirm, setShowConfirm] = useState(false);

  /** @type { React.MouseEventHandler<HTMLButtonElement> } */
  const handleClose = () => {
      setShowConfirm(false);
  };

  /** @type { React.MouseEventHandler<HTMLButtonElement> } */
  const handleShowConfirm = () => {
      setShowConfirm(true);
  };

  const handleDelete = () => {
    deleteFunction();
    setShowConfirm(false);
  };

  return (
    <>
      <Button onClick={handleShowConfirm} variant="danger" size="md" className="mt-3 me-3">{buttonLabel}</Button>
      <Modal show={showConfirm} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{'Warning'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">This is a permanent action.</p>
          <p className="font-weight-bold">The data below will be reset:</p>
          <div className="alert alert-warning" role="alert">
            <p>
              {description}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Nevermind
          </Button>
          <Button onClick={handleDelete} variant="danger" disabled={description === 'nothing'}>Yes, delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteConfirmation.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  deleteFunction: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
