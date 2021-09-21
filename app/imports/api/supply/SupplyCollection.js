import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const supplyPublications = {
  supply: 'Supply',
  supplyAdmin: 'SupplyAdmin',
};

class SupplyCollection extends BaseCollection {
  constructor() {
    super('Supplies', new SimpleSchema({
      name: String,
      location: String,
      quantity: Number,
    }));
  }

  /**
   * Defines a new Supply item.
   * @param name the name of the item.
   * @param location the location of the item.
   * @param quantity how many.
   * @return {String} the docID of the new document.
   */
  define({ name, location, quantity }) {
    const docID = this._collection.insert({
      name,
      location,
      quantity,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param location the new location (optional).
   * @param quantity the new quantity (optional).
   */
  update(docID, { name, location, quantity }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (location) {
      updateData.location = location;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the SupplyCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(supplyPublications.supply, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(supplyPublications.supplyAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeSupply() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supply);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeSupplyAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supplyAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const quantity = doc.quantity;
    const location = doc.location;
    return { name, quantity, location };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Supplies = new SupplyCollection();
