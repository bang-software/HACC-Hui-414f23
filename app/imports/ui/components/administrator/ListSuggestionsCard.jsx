import React from 'react';
import {
  Header,
  Item,
  Button,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
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
      aname,
      adescription,
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
        <Item
              style={{ padding: '0rem 2rem 2rem 2rem' }}>
            <Item.Content>
              <Item.Header>
                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  {name}
                </Header>
              </Item.Header>
              <Item.Meta>
                {type}
              </Item.Meta>
              <Item.Description>
                {description}
              </Item.Description>
              <Item.Extra>Suggested By: {username} </Item.Extra>
              <Button negative onClick={() => removeItem()}>Delete</Button>
              <Button positive onClick={() => addSuggestion(type, name, description, suggestionObj._id)}>Add Suggestion</Button>
            </Item.Content>
        </Item>
    );
};

ListSuggestionsCard.propTypes = {
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  suggestionObj: PropTypes.object.isRequired,
};
export default withTracker(() => ({
    suggestion: Suggestions.find({}).fetch(),
  }))(ListSuggestionsCard);
