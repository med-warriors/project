import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MATRP } from '../../api/matrp/MATRP';
import { Profiles } from '../../api/profile/Profile';
import { ROLE } from '../../api/role/Role';

// Call publish for all the collections.
MATRP.collections.forEach(c => c.publish());

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise publish nothing.
Meteor.publish(Profiles.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Profiles.collection.find({ owner: username });
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

/** Allows admins to look for users in the database */
Meteor.publish('adminPermission', function () {
  if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
    return Meteor.users.find({});
  }
  return this.ready();
});
