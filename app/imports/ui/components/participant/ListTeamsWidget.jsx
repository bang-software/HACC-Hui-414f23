import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Row, Container } from 'react-bootstrap';
import ListTeamExampleWidget from './ListTeamExampleWidget';
import { Teams } from '../../../api/team/TeamCollection';

const ListTeamsWidget = ({ teams }) => {
    const closed = Teams.find({ open: false }).count();
    return (
      <Container>
        <Row>
          {teams.map((team) => (
              <ListTeamExampleWidget key={team._id}
                                     team={team}
              />
          ))}
        </Row>
        <Row>
          <Alert variant={'info'}>There are {closed} closed teams.</Alert>
        </Row>
      </Container>
    );
};

ListTeamsWidget.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default ListTeamsWidget;
