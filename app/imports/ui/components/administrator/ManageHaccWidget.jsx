import React, { useState } from 'react';
import { Table, Container, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import SkillAdminWidget from './SkillAdminWidget';
import ChallengeAdminWidget from './ChallengeAdminWidget';
import ToolAdminWidget from './ToolAdminWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';
import { PAGE_IDS } from '../../testIDs/pageIDs';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
const ManageHaccWidget = () => {
  const { challenges, skills, tools } = useTracker(() => ({
        challenges: Challenges.find({}).fetch(),
        skills: Skills.find({}).fetch(),
        tools: Tools.find({}).fetch(),
      }));

  const [canCreateTeams, setCanCreateTeams] = useState(CanCreateTeams.findOne()?.canCreateTeams || false);
  const [canChangeChallenges, setCanChangeChallenges] = useState(CanChangeChallenges.findOne()?.canChangeChallenges || false);

  const toggleTeam = () => {
    const doc = CanCreateTeams.findOne();
    const updateData = {
      id: doc._id, canCreateTeams: !canCreateTeams,
    };

    const collectionName = CanCreateTeams.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      }
    });
    setCanCreateTeams(!canCreateTeams);
  };

  const toggleChallenge = () => {
    const doc = CanChangeChallenges.findOne();
    const updateData = {
      id: doc._id, canChangeChallenges: !canChangeChallenges,
    };
    const collectionName = CanChangeChallenges.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      }
    });
    setCanChangeChallenges(!canChangeChallenges);
  };

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
        <h2 className="centerText">Challenges</h2>
        <Table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Submission Detail</th>
            <th>Pitch</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {challenges.map((challenge => <ChallengeAdminWidget key={challenge._id} challenge={challenge}/>))}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center' }}>
          <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_CHALLENGE_BUTTON} className="addbutton">
            <Link to={ROUTES.ADD_CHALLENGE} style={{ color: 'white' }}>Add Challenge</Link></Button>
        </div>
      </div>
  );
  const ManageHaccSkillList = () => (
      <div>
        <h2 className="centerText">Skills</h2>
        <Table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {skills.map((skill => <SkillAdminWidget key={skill._id} skill={skill}/>))}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center' }}>
          <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_SKILL_BUTTON} className="addbutton">
            <Link to={ROUTES.ADD_SKILL} style={{ color: 'white' }}>Add Skill</Link></Button>
        </div>
      </div>
  );
  const ManageHaccToolList = () => (
      <div>
        <h2 className="centerText">Tools</h2>
        <Table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {tools.map((tool => <ToolAdminWidget key={tool._id} tool={tool}/>))}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center' }}>
          <Button id={COMPONENT_IDS.HACC_WIDGET_ADD_TOOL_BUTTON} className="addbutton">
            <Link to={ROUTES.ADD_TOOL} style={{ color: 'white' }}>Add Tool</Link></Button>
        </div>
      </div>
  );

  return (
      <Container id={PAGE_IDS.MANAGE_HACC_WIDGET_COMPONENT}>
        <Row>
          <ManageHacctop/>
        </Row>
        <Row className="cardStyle">
          <Col>
            <ManageHaccChallengeList/>
            <ManageHaccSkillList/>
            <ManageHaccToolList/>
          </Col>
        </Row>
      </Container>
  );
};

export default ManageHaccWidget;
