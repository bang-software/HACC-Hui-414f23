import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Container, Form, Nav, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';
import { ROUTES } from '../../../startup/client/route-constants';
import DeleteConfirmation from '../../components/administrator/DeleteConfirmation';
import ChallengeAdminWidget from '../../components/administrator/ChallengeAdminWidget';
import SkillAdminWidget from '../../components/administrator/SkillAdminWidget';
import ToolAdminWidget from '../../components/administrator/ToolAdminWidget';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { PAGE_IDS } from '../../testIDs/pageIDs';

const ConfigureHacc = () => {
  const [selectedSection, setSelectedSection] = useState('challenges');
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const [canCreateTeams, setCanCreateTeams] = useState(CanCreateTeams.findOne()?.canCreateTeams || false);
  const [canChangeChallenges, setCanChangeChallenges] = useState(CanChangeChallenges.findOne()?.canChangeChallenges || false);

  const toggleTeam = () => {
    const doc = CanCreateTeams.findOne();
    const updateData = {
      id: doc._id, canCreateTeams: !canCreateTeams,
    };
    const collectionName = CanCreateTeams.getCollectionName();
    updateMethod.call({ collectionName, updateData });
    setCanCreateTeams(!canCreateTeams);
  };

  const toggleChallenge = () => {
    const doc = CanChangeChallenges.findOne();
    const updateData = {
      id: doc._id, canChangeChallenges: !canChangeChallenges,
    };
    const collectionName = CanChangeChallenges.getCollectionName();
    updateMethod.call({ collectionName, updateData });
    setCanChangeChallenges(!canChangeChallenges);
  };

  const { challenges, skills, tools } = useTracker(() => ({
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
  }));

  const [challengeSort, setChallengeSort] = useState({ column: 'title', direction: 'asc' });
  const [skillSort, setSkillSort] = useState({ column: 'name', direction: 'asc' });
  const [toolSort, setToolSort] = useState({ column: 'name', direction: 'asc' });

  const handleSort = (section, column) => {
    if (section === 'challenges') {
      setChallengeSort((prevSort) => {
        if (prevSort.column === column) {
          return { column, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { column, direction: 'asc' };
      });
    } else if (section === 'skills') {
      setSkillSort((prevSort) => {
        if (prevSort.column === column) {
          return { column, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { column, direction: 'asc' };
      });
    } else if (section === 'tools') {
      setToolSort((prevSort) => {
        if (prevSort.column === column) {
          return { column, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { column, direction: 'asc' };
      });
    }
  };

  const sortData = (data, sort) => {
    const { column, direction } = sort;
    return [...data].sort((a, b) => {
      const valueA = (a[column] || '').toLowerCase(); // Check for empty strings
      const valueB = (b[column] || '').toLowerCase(); // Check for empty strings
      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);

    });
  };

  const sortedChallenges = sortData(challenges, challengeSort);
  const sortedSkills = sortData(skills, skillSort);
  const sortedTools = sortData(tools, toolSort);

  const ManageHacctop = () => (
      <Col className="title">
        <h2>Manage HACC</h2>
        <Container as={'h5'}>
          <Row className="centerEntire">
            <Col xs="auto">
              <Form.Check
                  type="switch"
                  id={COMPONENT_IDS.HACC_WIDGET_CUSTOM_SWITCH_TEAMS}
                  label="Can Create Teams"
                  checked={canCreateTeams}
                  onChange={toggleTeam}
              />
            </Col>
            <Col xs="auto">
              <Form.Check
                  type="switch"
                  id={COMPONENT_IDS.HACC_WIDGET_CUSTOM_SWITCH_CHALLENGES}
                  label="Can Change Challenges"
                  checked={canChangeChallenges}
                  onChange={toggleChallenge}
              />
            </Col>
          </Row>
        </Container>
      </Col>
  );
  const ManageHaccChallengeList = () => (
      <div>
        <div className="centerText">
          <Col>
            <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_CHALLENGE_BUTTON} className="addbutton mx-3">
              <Link to={ROUTES.ADD_CHALLENGE} style={{ color: 'white' }}>Add Challenge</Link></Button>
            <DeleteConfirmation collection={Challenges} name={'Challenges'} />
          </Col>
        </div>
        <Table>
          <thead>
          <tr>
            <th onClick={() => handleSort('challenges', 'title')}>
              Title{' '}
              {challengeSort.column === 'title' && (
                  challengeSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th onClick={() => handleSort('challenges', 'description')}>
              Description{' '}
              {challengeSort.column === 'description' && (
                  challengeSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th onClick={() => handleSort('challenges', 'submissionDetail')}>
              Submission Detail{' '}
              {challengeSort.column === 'submissionDetail' && (
                  challengeSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th onClick={() => handleSort('challenges', 'pitch')}>
              Pitch{' '}
              {challengeSort.column === 'pitch' && (
                  challengeSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {sortedChallenges.map((challenge => <ChallengeAdminWidget key={challenge._id} challenge={challenge}/>))}
          </tbody>
        </Table>
      </div>
  );
  const ManageHaccSkillList = () => (
      <div>
        <div className="centerText">
          <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_SKILL_BUTTON} className="addbutton">
            <Link to={ROUTES.ADD_SKILL} style={{ color: 'white' }}>Add Skill</Link></Button>
        </div>
        <Table>
          <thead>
          <tr>
            <th onClick={() => handleSort('skills', 'name')}>
              Name{' '}
              {skillSort.column === 'name' && (
                  skillSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th onClick={() => handleSort('skills', 'description')}>
              Description{' '}
              {skillSort.column === 'description' && (
                  skillSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {sortedSkills.map((skill => <SkillAdminWidget key={skill._id} skill={skill}/>))}
          </tbody>
        </Table>
      </div>
  );
  const ManageHaccToolList = () => (
      <div>
        <div className="centerText">
          <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_TOOL_BUTTON} className="addbutton">
            <Link to={ROUTES.ADD_TOOL} style={{ color: 'white' }}>Add Tool</Link></Button>
        </div>
        <Table>
          <thead>
          <tr>
            <th onClick={() => handleSort('tools', 'name')}>
              Name{' '}
              {toolSort.column === 'name' && (
                  toolSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th onClick={() => handleSort('tools', 'description')}>
              Description{' '}
              {toolSort.column === 'description' && (
                  toolSort.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>
              )}
            </th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {sortedTools.map((tool => <ToolAdminWidget key={tool._id} tool={tool}/>))}
          </tbody>
        </Table>
      </div>
  );

  return (
      <Container id={PAGE_IDS.MANAGE_HACC_WIDGET_COMPONENT}>
        <Row>
          <ManageHacctop/>
        </Row>
        <Row className="cardStyle">
          <Col>
            <div>
              <Nav style={{ backgroundColor: 'white', paddingTop: '1rem', borderRadius: '2rem' }}
                   variant="tabs" className="justify-content-center">
                <Nav.Item as="h2">
                  <Nav.Link
                      id={COMPONENT_IDS.HACC_WIDGET_NAV_CHALLENGE}
                      eventKey="challenges"
                      onClick={() => handleSectionChange('challenges')}
                      active={selectedSection === 'challenges'}
                  >
                    Challenges
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="h2">
                  <Nav.Link
                      id={COMPONENT_IDS.HACC_WIDGET_NAV_SKILL}
                      eventKey="skills"
                      onClick={() => handleSectionChange('skills')}
                      active={selectedSection === 'skills'}
                  >
                    Skills
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="h2">
                  <Nav.Link
                      id={COMPONENT_IDS.HACC_WIDGET_NAV_TOOl}
                      eventKey="tools"
                      onClick={() => handleSectionChange('tools')}
                      active={selectedSection === 'tools'}
                  >
                    Tools
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {selectedSection === 'challenges' && <ManageHaccChallengeList />}
              {selectedSection === 'skills' && <ManageHaccSkillList />}
              {selectedSection === 'tools' && <ManageHaccToolList />}
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default withAllSubscriptions(ConfigureHacc);
