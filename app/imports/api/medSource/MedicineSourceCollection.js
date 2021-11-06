import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medicinePublications = {
  MedicineSource: 'MedicineSource',
  MedicineSourceAdmin: 'MedicineSourceAdmin',
};

export const acquiredType = ['Donated', 'Purchased'];

export const medState = ['Acted', 'Reserves', 'Disposal', 'Return'];

class MedicineSourceCollection extends BaseCollection {
  constructor() {
    super('MedicineSource', new SimpleSchema({
      lotNumber: String,
      medName: String,
      quantity: Number,
      sourceName: String,
      acquire: {
        type: String,
        allowedValues: acquiredType,
      },
      cost: Number,
      receiveDate: Date,
      expDate: Date,
      state: {
        type: String,
        allowedValues: medState,
        defaultValue: 'Reserves',
      },
    }));
  }

  /**
   * Defines a new Medicine Origin object.
   * @param medName the name of the item.
   * @param quantity how many.
   * @param sourceName the name of the source
   * @param aquired how the item was aquired. (Donated or Purchased?)
   * @param purchasedAmount
   * @return {String} the docID of the new document.
   */
  define({ lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state }) {
    const docID = this._collection.insert({
      lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state,
    });
    return docID;
  }

  // Might reuse
  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param lotNumber the new name (optional).
   * @param name the new name (optional).
   * @param type the new quantity (optional).
   * @param location the new condition (optional).
   * @param quantity the new name (optional).
   * @param should_have the new quantity (optional).
   * @param expirationDate the new condition (optional).
   * @param source the new name (optional).
   */
  update(docID, { lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state }) {
    const updateData = {};
    if (lotNumber) {
      updateData.lotNumber = lotNumber;
    }
    if (medName) {
      updateData.namedNameme = medName;
    }
    if (sourceName) {
      updateData.sourceName = sourceName;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    if (location) {
      updateData.location = location;
    }
    if (acquire) {
      updateData.acquire = acquire;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(cost)) {
      updateData.cost = cost;
    }
    if (_.isDate(receiveDate)) {
      updateData.receiveDate = receiveDate;
    }
    if (_.isDate(expDate)) {
      updateData.receiveDate = expDate;
    }
    if (state) {
      updateData.source = state;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } lotNumber A document or docID in this collection.
   * @returns true
   */
  removeIt(lotNumber) {
    const doc = this.findDoc(lotNumber);
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
      // get the MedicineSourceCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(medicinePublications.MedicineSource, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(medicinePublications.MedicineSourceAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for medicine owned by the current user.
   */
  subscribeMedicineSource() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.MedicineSource);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeMedicineSourceAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.MedicineSourceAdmin);
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
    const lotNumber = doc.lotNumber;
    const medName = doc.medName;
    const quantity = doc.quantity;
    const location = doc.location;
    const sourceName = doc.sourceName;
    const acquire = doc.acquire;
    const cost = doc.cost;
    const receiveDate = doc.receiveDate;
    const expDate = doc.expDate;
    const state = doc.state;
    return { lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const MedicineSource = new MedicineSourceCollection();
