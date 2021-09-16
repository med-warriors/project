import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const supplySourcePublications = {
  supplies: 'Supplies',
  suppliesAdmin: 'SuppliesAdmin',
};

class SupplySourceCollection extends BaseCollection {
  constructor() {
    super('Supplies', new SimpleSchema({
      name: String,
      location: String,
      phoneNumber: Number,
      email: String,
    }));
  }

  /**
     * Defines a new Stuff item.
     * @param name the name of the item.
     * @param location how many.
     * @param owner the owner of the item.
     * @param phoneNumber the condition of the item.
     * @param email the email of the source.
     * @return {String} the docID of the new document.
     */
  define({ name, location, phoneNumber, email }) {
    const docID = this._collection.insert({
      name,
      location,
      phoneNumber,
      email,
    });
    return docID;
  }

  /**
     * Updates the given document.
     * @param docID the id of the document to update.
     * @param name the new name (optional).
   * * @param location the new condition (optional).
     * @param phoneNumber the new quantity (optional).
     * @param email the new condition (optional).
     */
  update(docID, { name, location, phoneNumber, email }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (location) {
      updateData.location = location;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(phoneNumber)) {
      updateData.phoneNumber = phoneNumber;
    }
    if (email) {
      updateData.email = email;
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
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(supplySourcePublications.supplies, function publish() {
        // if (this.userId) {
        // return instance._collection.find({ name: 'aloha' });
        // }
        return instance._collection.find();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(supplySourcePublications.suppliesAdmin, function publish() {
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
  subscribeSupplySource() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplySourcePublications.supplies);
    }
    return null;
  }

  /**
     * Subscription method for admin users.
     * It subscribes to the entire collection.
     */
  subscribeSupplySourceAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplySourcePublications.suppliesAdmin);
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
    const location = doc.location;
    const phoneNumber = doc.phoneNumber;
    const email = doc.email;
    const owner = doc.owner;
    return { name, location, phoneNumber, email, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const SupplySourecs = new SupplySourceCollection();
