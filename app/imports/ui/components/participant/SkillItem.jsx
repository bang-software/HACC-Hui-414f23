import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

const SkillItem = ({ item }) => (
  <ListGroup.Item>
    {item}
  </ListGroup.Item>
);

SkillItem.propTypes = {
  item: PropTypes.string.isRequired,
};

export default SkillItem;
