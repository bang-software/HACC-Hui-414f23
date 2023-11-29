import { Meteor } from 'meteor/meteor';

export const isAdminEmail = (email) => Meteor.settings.administrators.includes(email);
