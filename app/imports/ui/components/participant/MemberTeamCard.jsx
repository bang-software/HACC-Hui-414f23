import React from 'react';
import { Row, Container, Col, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const MemberTeamCard = ({ team, teamParticipants }) => {
  const teamID = team._id;
  const teamChallenges = TeamChallenges.find({ teamID }).fetch().map((tc) => Challenges.findDoc(tc.challengeID).title);
  const teamSkills = TeamSkills.find({ teamID }).fetch().map((ts) => Skills.findDoc(ts.skillID).name);
  const teamTools = TeamTools.find({ teamID }).fetch().map((tt) => Tools.findDoc(tt.toolID).name);
  return (
      <Container id={COMPONENT_IDS.MEMBER_TEAM_CARD}>
        <Row>
          <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
            <Icon.PeopleFill/>
            {team.name}
          </h3>
        </Row>
        <Row>
          <Col>
            GitHub: {team.gitHubRepo}<br/>
            DevPost: {team.devPostPage}
            <Image src={team.image} rounded size={96}/>
          </Col>
          <Col>
            <h6 className="mb-2 fw-bold">Challenges</h6>
            <ul>
              {teamChallenges.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </Col>
          <Col>
            <h6 className="mb-2 fw-bold">Skills</h6>
            <ul>
              {teamSkills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </Col>
          <Col>
            <h6 className="mb-2 fw-bold">Tools</h6>
            <ul>
              {teamTools.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </Col>
          <Col>
            <h6 className="mb-2 fw-bold">Members</h6>
            <ul>
              {teamParticipants.map((participant) => <li key={participant}>
                {participant.firstName} {participant.lastName}</li>)}
            </ul>
          </Col>
        </Row>
      </Container>
  );
};

MemberTeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
};

export default MemberTeamCard;
