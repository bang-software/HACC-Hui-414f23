import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import BaseSlugCollection from '../../../api/base/BaseSlugCollection';
/**
 * @type {React.FC<{ collection: BaseCollection, name: { string } }>}
 */
// eslint-disable-next-line react/prop-types
const DeleteConfirmation = ({ collection, name }) => {

    const [showConfirm, setShowConfirm] = useState(false);

    /** @type { React.MouseEventHandler<HTMLButtonElement> } */
    const handleClose = () => {
        setShowConfirm(false);
    };

    /** @type { React.MouseEventHandler<HTMLButtonElement> } */
    const handleDelete = () => {
        console.log('DeleteConfirmation collection prop:', collection);
        Meteor.call('BaseCollection.removeAll', `${name}`, (error) => {
            if (error) {
                console.error('Error removing all documents:', error);
            } else {
                // Handle success, result will be true if successful
            }
        });
        handleClose();
    };

    /** @type { React.MouseEventHandler<HTMLButtonElement> } */
    const handleShowConfirm = (e) => {
        if (e.ctrlKey) {
            handleDelete();
        } else {
            setShowConfirm(true);
        }
    };

    return (
        <>
            <Button onClick={handleShowConfirm} variant="danger" size="md">Delete</Button>
            <Modal show={showConfirm} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete all the ${name}?`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This is a permanent action.</p>
                    <p>Hold <code>ctrl</code>/<code>control</code> when you delete to not show this warning.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Nevermind
                    </Button>
                    <Button onClick={handleDelete} variant="danger">Yes, delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

DeleteConfirmation.propTypes = {
    collection: PropTypes.instanceOf(BaseSlugCollection).isRequired,
};

export default DeleteConfirmation;
