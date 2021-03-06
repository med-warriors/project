import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medicinePublications = {
  medicineSourceRecord: 'MedicineSourceRecord',
  medicineSourceRecordAdmin: 'MedicineSourceAdmin',
  medicineSourceRecordDoctor: 'MedicineSourceDoctor',
};

export const acquiredType = ['Donated', 'Purchased'];

export const medState = ['Acted', 'Reserves', 'Disposal', 'Return'];
export const supChange = ['In', 'Out', 'Update'];

class MedicineSourceRecordCollection extends BaseCollection {
  constructor() {
    super('MedicineSourceRecord', new SimpleSchema({
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
      editDate: Date,
      employee: String,
      action: {
        type: String,
        allowedValues: supChange,
      },
      change: String,
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
  define({ lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state, editDate, employee, action, change }) {
    const docID = this._collection.insert({
      lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state, editDate, employee, action, change,
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
   * @param quantity the new name (optional).
   * @param should_have the new quantity (optional).
   * @param expirationDate the new condition (optional).
   * @param source the new name (optional).
   */
  update(docID, { lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state, editDate, employee, action, change }) {
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
      updateData.expDate = expDate;
    }
    if (_.isDate(editDate)) {
      updateData.editDate = editDate;
    }
    if (state) {
      updateData.state = state;
    }
    if (employee) {
      updateData.employee = employee;
    }
    if (action) {
      updateData.action = action;
    }
    if (change) {
      updateData.change = change;
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
      // get the MedicineSourceRecordCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(medicinePublications.medicineSource, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(medicinePublications.medicineSourceAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(medicinePublications.medicineSourceDoctor, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.DOCTOR)) {
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
      return Meteor.subscribe(medicinePublications.medicineSource);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeMedicineSourceAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.medicineSourceAdmin);
    }
    return null;
  }

  /**
   * Subscription method for Doctor users.
   * It subscribes to the entire collection.
   */
  subscribeMedicineSourceDoctor() {
    if (Meteor.isClient) {
      return Meteor.subscribe(medicinePublications.medicineSourceDoctor);
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
    const editDate = doc.editDate;
    const employee = doc.employee;
    const action = doc.action;
    const change = doc.change;
    return { lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state, editDate, employee, action, change };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const MedicineSourceRecord = new MedicineSourceRecordCollection();
