import React from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Col, Row, Button } from 'react-bootstrap';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const TeamCard = ({ team, participantID }) => {
  const buildTheTeam = () => {
    const teamBTT = team;
    const teamID = teamBTT._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = tCs.map((tc) => Challenges.findDoc(tc.challengeID).title);
    teamBTT.challenges = challengeTitles;
    teamBTT.skills = TeamSkills.find({ teamID }).fetch().map((skill) => Skills.findDoc(skill.skillID).name);
    teamBTT.tools = TeamTools.find({ teamID }).fetch().map((tool) => Tools.findDoc(tool.toolID).name);

    const teamPs = TeamParticipants.find({ teamID }).fetch();
    teamBTT.members = teamPs.map((tp) => Participants.getFullName(tp.participantID));
    return teamBTT;
  };

  const handleLeaveTeam = (e) => {
    const teamID = e.target.value;
    // const { teamHLT } = inst;
    // const pDoc = Participants.findDoc({ userID: Meteor.userId() });
    // let collectionName = LeavingTeams.getCollectionName();
    // const definitionData = {
    //   username: pDoc.username,
    //   team: teamHLT._id,
    // };
    // defineMethod.call({ collectionName, definitionData }, (error) => {
    //   if (error) {
    //     console.error('failed to define', error);
    //   }
    // });
    const teamParticipantID = TeamParticipants.findDoc({ teamID: teamID, participantID: participantID })._id;
    const collectionName = TeamParticipants.getCollectionName();
    removeItMethod.call({ collectionName, instance: teamParticipantID }, (err) => {
      if (err) {
        console.error('failed to remove from team', err);
      }
    });
  };

  const builtTeam = buildTheTeam();
  const isOwner = builtTeam.owner === participantID;
  return (
      <Card id={COMPONENT_IDS.TEAM_CARD}>
        <Card.Body>
          <Card.Title>
            <h4 className="mb-2 fw-bold">{builtTeam.name}</h4>
          </Card.Title>
          <Container>
            <Row>
              <Col>
                <h6 className="mb-2 fw-bold">Challenges</h6>
                {builtTeam.challenges.join(', ')}
              </Col>
              <Col>
                <h6 className="mb-2 fw-bold">Desired Skills</h6>
                <ul>
                  {builtTeam.skills.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Col>
              <Col>
                <h6 className="mb-2 fw-bold">Desired Tools</h6>
                <ul>
                  {builtTeam.tools.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Col>
              <Col>
                <h6 className="mb-2 fw-bold">Members</h6>
                <ul>
                  {builtTeam.members.map((member, index) => <li key={`${index}${member}`}>{member}</li>)}
                </ul>
              </Col>
              <Col>
                <Button disabled={isOwner} variant="danger" value={team._id} onClick={handleLeaveTeam}>Leave team</Button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
  );
};

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;
