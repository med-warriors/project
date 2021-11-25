import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const supplyPublications = {
  supplySource: 'SupplySource',
  supplySourceAdmin: 'SupplySourceAdmin',
  supplySourceDoctor: 'SupplySourceDoctor',
};

export const acquiredType = ['Donated', 'Purchased'];

export const supState = ['Acted', 'Reserves', 'Disposal', 'Return'];

class SupplySourceCollectionRecord extends BaseCollection {
  constructor() {
    super('SuppliesSource', new SimpleSchema({
      supplyName: String,
      quantity: Number,
      sourceName: String,
      acquire: {
        type: String,
        allowedValues: acquiredType,
      },
      cost: Number,
      receiveDate: Date,
      state: {
        type: String,
        allowedValues: supState,
      },
    }));
  }

  /**
   * Defines a new Supply item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param sourceName source of supply
   * @param acquire purchase or donated?
   * @param cost how much does it cost
   * @param receiveDate When it was receive
   * @param state the state of the item.
   * @return {String} the docID of the new document.
   */
  define({ supplyName, quantity, sourceName, acquire, cost, receiveDate, state }) {
    const docID = this._collection.insert({
      supplyName,
      quantity,
      sourceName,
      acquire,
      cost,
      receiveDate,
      state,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param name the name of the item.
   * @param quantity how many.
   * @param sourceName source of supply
   * @param acquire purchase or donated?
   * @param cost how much does it cost
   * @param receiveDate When it was receive
   * @param state the new state (optional).
   */
  update(docID, { supplyName, quantity, sourceName, acquire, cost, receiveDate, state }) {
    const updateData = {};
    if (supplyName) {
      updateData.supplyName = supplyName;
    }
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    if (sourceName) {
      updateData.sourceName = sourceName;
    }
    if (acquire) {
      updateData.acquire = acquire;
    }
    if (_.isNumber(cost)) {
      updateData.cost = cost;
    }
    if (receiveDate) {
      updateData.receiveDate = receiveDate;
    }
    if (state) {
      updateData.state = state;
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
      // get the SupplySourceCollectionRecord instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(supplyPublications.supplySource, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(supplyPublications.supplySourceAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(supplyPublications.supplySourceDoctor, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.DOCTOR)) {
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
      return Meteor.subscribe(supplyPublications.supplySource);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeSupplyAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supplySourceAdmin);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeSupplyDoctor() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supplySourceDoctor);
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER, ROLE.DOCTOR]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const supplyName = doc.supplyName;
    const quantity = doc.quantity;
    const sourceName = doc.sourceName;
    const acquire = doc.acquire;
    const cost = doc.cost;
    const receiveDate = doc.receiveDate;
    const state = doc.state;
    return { supplyName, quantity, sourceName, acquire, cost, receiveDate, state };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const SupplySourceRecord = new SupplySourceCollectionRecord();
