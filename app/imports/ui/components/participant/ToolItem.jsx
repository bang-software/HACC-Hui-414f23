import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

const ToolItem = ({ item }) => (
        <ListGroup.Item>
          {item}
        </ListGroup.Item>
);

ToolItem.propTypes = {
  item: PropTypes.string.isRequired,
};

export default ToolItem;
