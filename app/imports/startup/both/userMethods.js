import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ROLE } from '../../api/role/Role';

Meteor.methods({
  /** A change roles function where user can change to one role */
  changeRoles: function (userId, role) {
    check(userId, String);
    check(role, String);

    const user = Meteor.user();

    if (!user || !Roles.userIsInRole(user, ROLE.ADMIN)) {
      throw new Meteor.Error('access-denied', 'Access Denied');
    }

    Roles.setUserRoles(userId, role);
  },

  /** A change roles function where user can change to two roles */
  changeRoles2: function (userId, role1, role2) {
    check(userId, String);
    check(role1, String);
    check(role2, String);

    const user = Meteor.user();

    if (!user || !Roles.userIsInRole(user, ROLE.ADMIN)) {
      throw new Meteor.Error('access-denied', 'Access Denied');
    }

    Roles.setUserRoles(userId, [role1, role2]);
  },
});
