import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
/**
 * @type {React.FC<{ collection: BaseCollection, name: { string } }>}
 */
// eslint-disable-next-line react/prop-types
const DeleteConfirmation = () => {

    const [showConfirm, setShowConfirm] = useState(false);

    /** @type { React.MouseEventHandler<HTMLButtonElement> } */
    const handleClose = () => {
        setShowConfirm(false);
    };

    /** @type { React.MouseEventHandler<HTMLButtonElement> } */
    const handleDelete = () => {
        Meteor.call('BaseCollection.removeAll', 'Teams', (error) => {
            if (error) {
                console.error('Error removing all documents:', error);
            } else {
                // Handle success, result will be true if successful
            }
        });
        Meteor.call('BaseCollection.removeAll', 'Challenges', (error) => {
            if (error) {
                console.error('Error removing all documents:', error);
            } else {
                // Handle success, result will be true if successful
            }
        });
        Meteor.call('BaseCollection.removeAll', 'Users', (error) => {
            if (error) {
                console.error('Error removing all documents:', error);
            } else {
                // Handle success, result will be true if successful
            }
        });
        Meteor.call('BaseCollection.removeAll', 'Participants', (error) => {
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
            <Button onClick={handleShowConfirm} variant="danger" size="md">Reset Data</Button>
            <Modal show={showConfirm} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{'Are you sure you want to reset all the data'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">This is a permanent action.</p>
                    <p className="font-weight-bold">The data below will be reset:</p>
                    <div className="alert alert-warning" role="alert">
                        <ul className="list-unstyled">
                            <li><i className="bi bi-person-fill text-danger"></i> Users</li>
                            <li><i className="bi bi-people-fill text-primary"></i> Participants</li>
                            <li><i className="bi bi-trophy-fill text-success"></i> Challenges</li>
                            <li><i className="bi bi-diagram-3-fill text-info"></i> Teams</li>
                        </ul>
                    </div>
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

};

export default DeleteConfirmation;
