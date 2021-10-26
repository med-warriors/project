import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
// import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medicinePublications = {
  medicine: 'Medicine',
  medicineAdmin: 'MedicineAdmin',
};

// All location of medicine given in excel document.
// CONSIDER: creating a collection to insert more location spot
export const locSpot = ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5', 'Case 6', 'Case 7', 'Case 8', 'Refrigerator', 'Refrigerator Closet', 'Freezer', 'Freezer-Derm', 'Drawer 2-2', 'Drawer 2-3', 'Bottom Drawer', 'Emergency Kit'];

export const acquiredType = ['Donated', 'Purchased'];

export const medState = ['Acted', 'Reserves', 'Disposal', 'Return'];

class MedicineInventoryCollection extends BaseCollection {
  constructor() {
    super('Medicines', new SimpleSchema({
      lotNumber: String,
      medName: String,
      quantity: Number,
      sourceName: String,
      acquire: {
        type: String,
        allowedValues: acquiredType,
      },
      cost: Number,
      location: {
        type: String,
        allowedValues: locSpot,
      },
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
  define({ lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state }) {
    const docID = this._collection.insert({
      lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state,
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
  update(docID, { lotNumber, name, type, location, quantity, should_have, expirationDate, source }) {
    const updateData = {};
    if (lotNumber) {
      updateData.lotNumber = lotNumber;
    }
    if (name) {
      updateData.name = name;
    }
    if (type) {
      updateData.type = type;
    }
    if (location) {
      updateData.location = location;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(should_have)) {
      updateData.should_have = should_have;
    }
    if (_.data(expirationDate)) {
      updateData.expirationDate = expirationDate;
    }
    if (source) {
      updateData.source = source;
    }
    this._collection.update(docID, { $set: updateData });
  }
*/

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
      Meteor.publish(medicinePublications.medicine, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(medicinePublications.medicineAdmin, function publish() {
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
  subscribeMedicine() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.medicine);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeMedicineAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.medicineAdmin);
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
    const sourceName = doc.sourceName;
    const acquire = doc.acquire;
    const cost = doc.cost;
    const receiveDate = doc.receiveDate;
    const expDate = doc.expDate;
    const state = doc.state;
    return { lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const MedicineInventory = new MedicineInventoryCollection();
