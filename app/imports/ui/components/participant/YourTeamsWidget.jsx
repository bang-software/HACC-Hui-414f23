import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';
import MemberTeamCard from './MemberTeamCard';
import { paleBlueStyle } from '../../styles';

function YourTeamsWidget() {

  const data = useTracker(() => {
    const participant = Participants.findOne({ userID: Meteor.userId() });
    const participantID = participant?._id;
    const teams = Teams.find({ owner: participantID }).fetch();
    const teamParticipantsArray = TeamParticipants.find({ participantID }).fetch();
    const memberTeamsIDs = [...new Set(teamParticipantsArray.map(item => item.teamID))];
    const memberTeams = memberTeamsIDs.map(id => Teams.findOne(id));
    const allParticipants = Participants.find({}).fetch();
    const teamInvitations = TeamInvitations.find({}).fetch();

    return {
      participant,
      teams,
      memberTeams,
      allParticipants,
      teamParticipantsArray,
      teamInvitations,
    };
  });

  function getTeamParticipants(teamID) {
    const filteredParticipants = data.teamParticipantsArray.filter(tp => tp.teamID === teamID);
    return filteredParticipants.map(fp => {
      const participantDetail = data.allParticipants.find(p => p._id === fp.participantID);
      return {
        firstName: participantDetail.firstName,
        lastName: participantDetail.lastName,
      };
    });
  }

  if (!data.participant?.isCompliant) {
    return (
      <div className="text-center">
        <h2>
          <i className="fas fa-thumbs-down"></i>
          You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          &nbsp;or we haven&apos;t received the signed form yet.
        </h2>
        <p>You can&apos;t be the owner of a team until you do. Please check back later.</p>
      </div>
    );
  }

  if (data.teams.length + data.memberTeams.length === 0) {
    return (
      <div className="text-center">
        <h2>
          <i className="fas fa-users"></i>
          You are not the owner or member of any teams
        </h2>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2 className="text-center mb-3">Your Teams</h2>
      </div>
      {data.teams.length !== 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card" style={paleBlueStyle}>
              <h4 className="card-header text-center">Owner</h4>
              <div className="card-body">
                {data.teams.map(team => (
                  <YourTeamsCard key={team._id} teams={team}
                                 teamParticipants={getTeamParticipants(team._id)} teamInvitation={data.teamInvitations} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {data.memberTeams.length !== 0 && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <h4 className="card-header text-center">Member</h4>
              <div className="card-body">
                {data.memberTeams.map(team => (
                  <MemberTeamCard key={team._id} team={team} teamParticipants={getTeamParticipants(team._id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourTeamsWidget;
