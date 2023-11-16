import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListSuggestionsWidget from '../../components/administrator/ListSuggestionsWidget';

const ListSuggestions = () => (
  <div>
    <ListSuggestionsWidget />
  </div>
);

export default withAllSubscriptions(ListSuggestions);
