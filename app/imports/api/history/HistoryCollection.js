import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const historyTranConditions = ['In', 'Out'];
export const historyTypeConditions = ['Medicine', 'Supply'];
export const historyPublications = {
  history: 'history',
  historyAdmin: 'historyAdmin',
};

class HistoryCollection extends BaseCollection {
  constructor() {
    super('Histories', new SimpleSchema({
      date: Date,
      transact: {
        type: String,
        allowedValues: historyTranConditions,
        defaultValue: 'In',
      },
      type: {
        type: String,
        allowedValues: historyTypeConditions,
        defaultValue: 'Medicine',
      },
      patientName: String,
      prescription: String,
      employee: Number,
    }));
  }

  /**
   * Defines a new History item.
   * @param Date the date of transact.
   * @param transact the transact of the item.
   * @param type the type of item.
   * @param patientName the Patient Name of transact.
   * @param employee the employee of transact.
   * @return {String} the docID of the new document.
   */
  define({ date, transact, type, patientName, prescription, employee }) {
    const docID = this._collection.insert({
      date,
      transact,
      type,
      patientName,
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
   * @param patientName the new condition (optional).
   * @param prescription the new prescription (optional).
   * @param employee the new employee (optional).
   */
  update(docID, { transact, type, patientName, prescription, employee }) {
    const updateData = {};
    if (transact) {
      updateData.transact = transact;
    }
    if (type) {
      updateData.type = type;
    }
    if (patientName) {
      updateData.patientName = patientName;
    }
    if (prescription) {
      updateData.prescription = prescription;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(employee)) {
      updateData.employee = employee;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(employee) {
    const doc = this.findDoc(employee);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the History associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the HistoryCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(historyPublications.history, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(historyPublications.historyAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for history owned by the current user.
   */
  subscribeHistory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(historyPublications.history);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeHistoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(historyPublications.historyAdmin);
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
    const date = doc.date;
    const transact = doc.transact;
    const type = doc.type;
    const patientName = doc.patientName;
    const prescription = doc.prescription;
    const employee = doc.employee;
    return { date, transact, type, patientName, prescription, employee };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Histories = new HistoryCollection();
