import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const transationHistoriesPublications = {
  transationHistory: 'TransationHistory',
  transationHistoryAdmin: 'TransationHistoryAdmin',
};

class TransationHistoriesCollection extends BaseCollection {
  constructor() {
    super('TransationHistories', new SimpleSchema({
      date: Date,
      transact: String,
      type: String,
      patientID: String,
      prescription: String,
      employee: String,
    }));
  }

  /**
   * Defines a new History item.
   * @param Date the date of transact.
   * @param transact the transact of the item.
   * @param type the type of item.
   * @param patientID the Patient Name of transact.
   * @param employee the employee of transact.
   * @return {String} the docID of the new document.
   */
  define({ date, transact, type, patientID, prescription, employee }) {
    const docID = this._collection.insert({
      date,
      transact,
      type,
      patientID,
      prescription,
      employee,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param transact the new transact (optional).
   * @param type the new type (optional).
   * @param patientID the new condition (optional).
   * @param prescription the new prescription (optional).
   * @param employee the new employee (optional).
   */
  update(docID, { transact, type, patientID, prescription, employee }) {
    const updateData = {};
    if (transact) {
      updateData.transact = transact;
    }
    if (type) {
      updateData.type = type;
    }
    if (patientID) {
      updateData.patientID = patientID;
    }
    if (prescription) {
      updateData.prescription = prescription;
    }
    if (employee) {
      updateData.employee = employee;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(date) {
    const doc = this.findDoc(date);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the history associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the MedicineCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(transationHistoriesPublications.transationHistory, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(transationHistoriesPublications.transationHistoryAdmin, function publish() {
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
  subscribeTransationHistory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(transationHistoriesPublications.transationHistory);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeTransationHistoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(transationHistoriesPublications.transationHistoryAdmin);
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
   * @return {{owner: (*|number), transact: *, type: *, patientID: *, prescription: *, employee: *, date}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const date = doc.date;
    const transact = doc.transact;
    const type = doc.type;
    const patientID = doc.patientID;
    const prescription = doc.prescription;
    const employee = doc.employee;
    return { date, transact, type, patientID, prescription, employee };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const TransationHistories = new TransationHistoriesCollection();
