import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Spinner } from 'react-bootstrap';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from './ProfileCard';
import { ROUTES } from '../../../startup/client/route-constants';
import TeamMembershipWidget from './TeamMembershipWidget';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';

const Profile = () => {
    const { model, ready } = useTracker(() => {
      const sub2 = ParticipantChallenges.subscribe();
      const sub3 = ParticipantSkills.subscribe();
      const sub4 = ParticipantTools.subscribe();
      const sub5 = Challenges.subscribe();
      const sub6 = Skills.subscribe();
      const sub7 = Tools.subscribe();
      const rdy = sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready();
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      const participantID = participant._id;
      const challengeTitles = ParticipantChallenges.find({ participantID }).fetch().map(
        (challenge) => Challenges.findDoc(challenge.challengeID).title,
        );
      const skillNames = ParticipantSkills.find({ participantID }).fetch().map(
        (skill) => Skills.findDoc(skill.skillID).name,
      );
      const toolNames = ParticipantTools.find({ participantID }).fetch().map(
        (tool) => Tools.findDoc(tool.toolID).name,
      );
      const tempModel = participant;
      tempModel.challenges = challengeTitles;
      tempModel.skills = skillNames;
      tempModel.tools = toolNames;
      return {
        model: tempModel,
        ready: rdy,
      };
    }, []);
  return (ready ? (
    <div style={{ paddingBottom: '50px', paddingTop: '40px' }}><Container>
      <div style={paleBlueStyle}>
        <h2>Your Profile</h2>
        <ProfileCard model={model}/>
          <Link to={ROUTES.EDIT_PROFILE} style={{ color: '#ffffff' }}>
            <Button>Edit Profile</Button>
          </Link>
      </div>
      <div style={paleBlueStyle}>
        <h2>Team Membership</h2>
        <TeamMembershipWidget/>
      </div>
    </Container>
    </div>
  ) : <Spinner/>);
};

export default Profile;
