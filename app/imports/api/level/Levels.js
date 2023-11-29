import { faker } from '@faker-js/faker';

/** @namespace api/level */

/**
 * The different demographic levels.
 * @type {{PROFESSIONAL: string, COLLEGE: string, HIGH_SCHOOL: string}}
 * @memberOf api/level
 */
export const demographicLevel = [
  { label: 'Middle school', value: 'MIDDLE_SCHOOL' },
  { label: 'High school', value: 'HIGH_SCHOOL' },
  { label: 'College', value: 'COLLEGE' },
  { label: 'Professional', value: 'PROFESSIONAL' },
];

/**
 * The different demographic levels.
 * @type {Array}
 * @memberOf api/level
 */
export const demographicLevels = Object.values(demographicLevel);

/**
 * The different skill and tool levels.
 * @type {{EXPERIENCED: string, DONT_KNOW: string, NOVICE: string}}
 * @memberOf api/level
 */
export const skillAndToolLevel = {
  DONT_KNOW: 'Don\'t know, but would like to learn',
  NOVICE: 'Novice',
  EXPERIENCED: 'Experienced',
};

/**
 * The different skill and tool levels.
 * @type {Array}
 * @memberOf api/level
 */
export const skillAndToolLevels = Object.values(skillAndToolLevel);

/**
 * Returns a random demographic level.
 * @return {*}
 * @memberOf api/test-utilities
 */
export const getRandomDemographicLevel = () => {
  const index = faker.datatype.number({ min: 0, max: demographicLevels.length - 1 });
  return demographicLevels[index].value;
};

/**
 * Returns a random skill and tool level.
 * @return {*}
 * @memberOf api/test-utilities
 */
export const getRandomSkillAndToolLevel = () => {
  const index = faker.datatype.number({ min: 0, max: skillAndToolLevels.length - 1 });
  return skillAndToolLevels[index];
};
