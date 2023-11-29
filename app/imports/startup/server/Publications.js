import { Meteor } from 'meteor/meteor';
import { HACCHui } from '../../api/hacc-hui/HACCHui';

// Publish all the collections you need.
HACCHui.collections.forEach((collection) => collection.publish());

// Need this for the alanning:roles package
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
