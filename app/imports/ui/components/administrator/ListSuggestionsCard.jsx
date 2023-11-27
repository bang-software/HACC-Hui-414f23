import React from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';

const ListSuggestionsCard = ({ type, username, name, description, suggestionObj }) => {

  const removeItem = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this suggestion!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Suggestions.getCollectionName(),
              instance: suggestionObj._id,
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Suggestion removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

  const addSuggestion = (atype, aname, adescription, instance) => {
    let collectionName;
    if (atype.toLowerCase() === 'skill') {
      collectionName = Skills.getCollectionName();
    } else if (atype.toLowerCase() === 'tool') {
      collectionName = Tools.getCollectionName();
    } else {
      swal('Error', 'Undefined type of suggestion', 'error');
      return false;
    }
    const definitionData = {
      name,
      description,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error defining', error.message, 'error');
      }
      collectionName = Suggestions.getCollectionName();
      removeItMethod.call({ collectionName, instance }, (err) => {
        if (err) {
          swal('Error removing', err.message, 'error');
        }
      });
    });
    return true;
  };

  return (
      <Card key={suggestionObj} style={{ width: '18rem', margin: '1rem' }}>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{type}</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Card.Text>Suggested By: {username}</Card.Text>
          <Button variant="danger" onClick={() => removeItem(suggestionObj)}>
            Delete
          </Button>
          <Button
              variant="success"
              onClick={() => addSuggestion(type, name, description, suggestionObj)}
          >
            Add Suggestion
          </Button>
        </Card.Body>
      </Card>
  );
};

ListSuggestionsCard.propTypes = {
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  suggestionObj: PropTypes.object.isRequired,
};
export default ListSuggestionsCard;
