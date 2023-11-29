import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

/** @namespace api/role */

/**
 * ROLE Provides ROLE.ADMIN and ROLE.PARTICIPANT.
 * @type {{PARTICIPANT: string, ADMIN: string}}
 * @memberOf api/role
 */
export const ROLE = {
  ADMIN: 'ADMIN',
  PARTICIPANT: 'PARTICIPANT',
};

/**
 * The roles in HACC-Hui.
 * @type {Array}
 * @memberOf api/role
 */
export const ROLES = Object.values(ROLE);

/**
* Predicate for determining if a string is a defined ROLE.
* @param { String } role The role.
* @returns {boolean} True if role is a defined ROLE.
* @memberOf api/role
*/
export function isRole(role) {
  return (typeof role) === 'string' && Object.values(ROLE).includes(role);
}

/**
 * Ensures that role(s) are valid roles.
 * @param role The role or an array of roles.
 * @throws { Meteor.Error } If any of role(s) are not valid.
 * @memberOf api/role
 */
export function assertRole(role) {
  const roleArray = (Array.isArray(role)) ? role : [role];
  roleArray.forEach((theRole) => {
    if (!isRole(theRole)) {
      throw new Meteor.Error(`${role} is not defined, or includes at least one undefined role.`, '', Error().stack);
    }
  });
}

// Initialize Roles to ROLENAMES by deleting all existing roles, then defining just those in ROLENAMES.
if (Meteor.isServer) {
  if (Roles.getAllRoles().count() !== 2) {
    Object.values(ROLE).map((role) => Roles.createRole(role, { unlessExists: true }));
  }
}
