/**
 * Filters through the inputted data based on user input. If the search query is empty, it returns
 * the entire dataset.
 * @param data The data
 * @param searchQuery The search query
 * @returns {[]|*} Returns the filtered data
 */
export const filterBySearch = (data, searchQuery) => {
  if (searchQuery.length === 0) {
    return data;
  }
  const list = [];
  for (let i = 0; i < data.length; i++) {
    const participantFirstName = data[i].firstName;
    const participantLastName = data[i].lastName;
    const firstLowercase = participantFirstName.toString().toLowerCase();
    const lastLowercase = participantLastName.toString().toLowerCase();
    if (firstLowercase.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    } else if (lastLowercase.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    } else if (searchQuery.toString().toLowerCase() === `${firstLowercase} ${lastLowercase}`) {
      list.push(data[i]);
    } else if (data[i].username.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    }
  }

  return list;
};

/**
 *
 * @param data The data we want to sort
 * @param value The value we want to sort by
 * @returns {Array|*} Returns the sorted array
 */
export const sortBy = (data, value) => {
  if (value === 'participants') {
    return data.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      }
      if (a.lastName > b.lastName) {
        return 1;
      }
      return 0;
    });
  }
  return data;
};

/**
 * Filters through the data based on the user selection. By default, if no option is selected it
 * returns the original data
 * @param value The inputs given
 * @param allSkills All the available skills
 * @param participantSkill Each participants' skills
 * @param participant The participants
 * @returns {[]|*} Returns the export const filtered array
 */
export const filterBySkills = (value, allSkills, participantSkill, participant) => {

  // if there are no skills selected
  if (value.length === 0) {
    return participant;
  }

  // convert from skillName --> skillID
  const skillID = [];
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < allSkills.length; j++) {
      if (value[i] === allSkills[j].name) {
        skillID.push(allSkills[j]._id);
      }
    }
  }

  // get participantIDs for those that have the skills
  let participantsWithSkill = [];
  for (let i = 0; i < skillID.length; i++) {
    for (let j = 0; j < participantSkill.length; j++) {
      if (skillID[i] === participantSkill[j].skillID) {
        participantsWithSkill.push(participantSkill[j].participantID);
      }
    }
  }

  // Ensure there's no duplicate participantIDs
  participantsWithSkill = Array.from(new Set(participantsWithSkill));

  // Get the filtered participants
  const participants = [];
  for (let i = 0; i < participantsWithSkill.length; i++) {
    for (let j = 0; j < participant.length; j++) {
      if (participantsWithSkill[i] === participant[j]._id) {
        participants.push(participant[j]);
      }
    }
  }

  return participants;
};

/**
 * Filters through the data based on the user selection. By default, if no option is selected it
 * returns the original data
 * @param value The inputs given
 * @param allTools All the available tools
 * @param participantTools Each teams' tools
 * @param participant The teams
 * @returns {[]|*} Returns the export const filtered array
 */
export const filterByTools = (value, allTools, participantTools, participant) => {

  // if there are no tools selected
  if (value.length === 0) {
    return participant;
  }

  // convert from toolName --> toolID
  const toolID = [];
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < allTools.length; j++) {
      if (value[i] === allTools[j].name) {
        toolID.push(allTools[j]._id);
      }
    }
  }

  // get participantIDs for those that have the tools
  let participantsWithTool = [];
  for (let i = 0; i < toolID.length; i++) {
    for (let j = 0; j < participantTools.length; j++) {
      if (toolID[i] === participantTools[j].toolID) {
        participantsWithTool.push(participantTools[j].participantID);
      }
    }
  }

  // Ensure there's no duplicate participantIDs
  participantsWithTool = Array.from(new Set(participantsWithTool));

  // Get the filtered participants
  const participants = [];
  for (let i = 0; i < participantsWithTool.length; i++) {
    for (let j = 0; j < participant.length; j++) {
      if (participantsWithTool[i] === participant[j]._id) {
        participants.push(participant[j]);
      }
    }
  }
  return participants;
};

/**
 * Filters through the data based on the user selection. By default, if no option is selected it
 * returns the original data
 * @param value The inputs given
 * @param allChallenges All the available challenges
 * @param participantChallenge Each participants' challenge(s)
 * @param participant The participants
 * @returns {[]|*} Returns the filtered array
 */
export const filterByChallenge = (value, allChallenges, participantChallenge, participant) => {

  // if there are no tools selected
  if (value.length === 0) {
    return participant;
  }

  // convert from challengeName --> challengeID
  const challengeID = [];
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < allChallenges.length; j++) {
      if (value[i] === allChallenges[j].title) {
        challengeID.push(allChallenges[j]._id);
      }
    }
  }

  // get participantIDs for those that have the challenges
  let participantsWithChallenge = [];
  for (let i = 0; i < challengeID.length; i++) {
    for (let j = 0; j < participantChallenge.length; j++) {
      if (challengeID[i] === participantChallenge[j].challengeID) {
        participantsWithChallenge.push(participantChallenge[j].participantID);
      }
    }
  }

  // Ensure there's no duplicate teamIDs
  participantsWithChallenge = Array.from(new Set(participantsWithChallenge));

  // Get the filtered participants
  const participants = [];
  for (let i = 0; i < participantsWithChallenge.length; i++) {
    for (let j = 0; j < participant.length; j++) {
      if (participantsWithChallenge[i] === participant[j]._id) {
        participants.push(participant[j]);
      }
    }
  }
  return participants;
};

/**
 * Filters through the data based on the user selection. By default, if no option is selected it
 * returns the original data
 * @param value The inputs given
 * @param allTeams All the available Teams
 * @param participantTeam Each participants' Team(s)
 * @param participant The participants
 * @returns {[]|*} Returns the filtered array
 */
export const filterByTeam = (value, allTeams, participantTeam, participant) => {

  // if there are no tools selected
  if (value.length === 0) {
    return participant;
  }

  // convert from TeamName --> TeamID
  const teamID = [];
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < allTeams.length; j++) {
      if (value[i] === allTeams[j].title) {
        teamID.push(allTeams[j]._id);
      }
    }
  }

  // get participantIDs for those that have the Teams
  let participantsWithTeam = [];
  for (let i = 0; i < teamID.length; i++) {
    for (let j = 0; j < participantTeam.length; j++) {
      if (teamID[i] === participantTeam[j].TeamID) {
        participantsWithTeam.push(participantTeam[j].participantID);
      }
    }
  }

  // Ensure there's no duplicate teamIDs
  participantsWithTeam = Array.from(new Set(participantsWithTeam));

  // Get the filtered participants
  const participants = [];
  for (let i = 0; i < participantsWithTeam.length; i++) {
    for (let j = 0; j < participant.length; j++) {
      if (participantsWithTeam[i] === participant[j]._id) {
        participants.push(participant[j]);
      }
    }
  }
  return participants;
};

/**
 * Supplies all the possible values to make it work with Bootstrap's dropdown
 * @param data The values
 * @returns {Array} Returns an array that can be used by Bootstrap's dropdown
 */
export const dropdownValues = (data, mapValue) => {
  let values = data.map((d) => d[mapValue]);
  const categories = values.flat(Infinity);
  values = Array.from(new Set(categories));

  const info = [];

  for (let i = 0; i < values.length; i++) {
    info.push({
      key: values[i],
      label: values[i],
      value: values[i],
    });
  }

  info.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
  return info;
};
