import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Alert, Row, Container, Spinner } from 'react-bootstrap';
import ListTeamItem from './ListTeamItem';
import { Teams } from '../../../api/team/TeamCollection';

const ListTeamsWidget = ({ teams }) => {
  const { ready, closed } = useTracker(() => {
    const sub = Teams.subscribe();
    const closed2 = Teams.find({ open: false }).count();
    const rdy = sub.ready();
    return { ready: rdy, closed: closed2 };
  });
    return (ready ? (
      <Container>
        <Row>
          {teams.map((team) => (
              <ListTeamItem key={team._id}
                            team={team}
              />
          ))}
        </Row>
        <Row>
          <Alert variant={'info'}>There are {closed} closed teams.</Alert>
        </Row>
      </Container>
    ) : <Spinner/>);
};

ListTeamsWidget.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default ListTeamsWidget;
