import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';
import { useTracker } from 'meteor/react-meteor-data';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import ListSuggestionsCard from './ListSuggestionsCard';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import * as filters from './ListSuggestionsFilter';

const ListSuggestionsWidget = () => {
  const { suggestions } = useTracker(() => ({
    suggestions: Suggestions.find({}).fetch(),
  }), []);

  const [search, setSearch] = useState('');
  const [type, setType] = useState([]);
  const [result, setResult] = useState([...suggestions].sort((a, b) => a.name.localeCompare(b.name)));
  const [selectedType, setSelectedType] = useState('All');

  const setFilters = () => {
    const searchResults = filters.filterBySearch(suggestions, search);
    const typeResults = filters.typeResults(searchResults, type);
    const sorted = filters.sortBy(typeResults, 'names');
    setResult([...sorted]);
  };

  useEffect(() => {
    setFilters();
  }, [suggestions, search, type]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const getType = (value) => {
    setType(value);
    setSelectedType(value);
  };

  const typeOptions = ['All', 'Tool', 'Skill'];

  return (
    <Container fluid style={{ paddingBottom: '4rem' }} id={PAGE_IDS.LIST_SUGGESTIONS_ADMIN}>
      <Row style={{ paddingTop: '2rem' }}>
        <h2 className="text-center">Suggestions</h2>
      </Row>
      <Row>
        <Col style={{ paddingLeft: '7rem' }} md={4}>
          <Card style={{ position: 'sticky', top: '6.5rem' }}>
            <Card.Body>
              <Card.Title>Total Suggestions: {result.length}</Card.Title>
              <Form.Control
                type="search"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
              <h5 style={{ paddingTop: '2rem' }}>Suggestion Types</h5>
              <DropdownButton title={selectedType} onSelect={getType}>
                {typeOptions.map((option) => (
                  <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                ))}
              </DropdownButton>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {suggestions.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <FaUsers size={60} />
              <h2>
                There are no suggestions at the moment.
              </h2>
              <p>Please check back later.</p>
            </div>
          ) : (
            <Row>
              {result.map((suggestion) => (
                <Col key={suggestion._id} md={4} className="mb-3">
                  <ListSuggestionsCard
                    type={suggestion.type}
                    username={suggestion.username}
                    name={suggestion.name}
                    description={suggestion.description}
                    suggestionObj={suggestion}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default ListSuggestionsWidget;
