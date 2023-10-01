import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from './ProfileCard';
import { ROUTES } from '../../../startup/client/route-constants';
import TeamMembershipWidget from './TeamMembershipWidget';

const Profile = ({ participant, devChallenges, devSkills, devTools }) => {

  const buildModel = () => {
    const model = participant;
    model.challenges = devChallenges.map((challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = devSkills;
    model.tools = devTools;
    return model;
  };

  const model = buildModel();
  return (
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
  );
};

Profile.propTypes = {
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
    PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
    PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

const ProfileCon = withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    participant,
    devChallenges,
    devSkills,
    devTools,
  };
})(Profile);

export default withRouter(ProfileCon);
