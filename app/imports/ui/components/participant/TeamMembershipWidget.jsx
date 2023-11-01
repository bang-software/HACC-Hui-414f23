import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import TeamCard from './TeamCard';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { COMPONENT_IDS } from '../../testIDs/componentIDs';

const TeamMembershipWidget = () => {
  const { teams, participantID } = useTracker(() => {
    const partID = Participants.findOne({ userID: Meteor.userId() })._id;
    const teamsParts = TeamParticipants.find({ participantID: partID }).fetch();
    const userTeams = teamsParts.map((tP) => Teams.findDoc(tP.teamID));
    return {
      participantID: partID,
      teams: userTeams,
    };
  }, [Meteor.userId()]);

  return (
      <div id={COMPONENT_IDS.TEAM_MEMBERSHIP_WIDGET}>
        <React.Fragment>
          {teams.map((team) => <TeamCard team={team}
                                         key={team._id} participantID={participantID}/>)}
        </React.Fragment>
      </div>
  );
};
export default TeamMembershipWidget;
