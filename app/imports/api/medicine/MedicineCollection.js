import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medType = ['Allergy and Cold Medicines', 'Analgesics/Antiinflammatory', 'Antihypertensives', 'Antimicrobials', 'Cardiac/Cholesterol', 'Dermatologic Preparations', 'Diabetes' +
  'Meds', 'Ear and Eye Preparations', 'Emergency Kit', 'GI Meds', 'GYN Meds', 'Pulmonary', 'Smoking Cessation', 'Vitamins and Supplements'];

export const medicinePublications = {
  medicine: 'Medicine',
  medicineAdmin: 'MedicineAdmin',
};

class MedicineCollection extends BaseCollection {
  constructor() {
    super('Medicines', new SimpleSchema({
      lotNumber: String,
      name: String,
      type: {
        type: String,
        allowedValues: medType,
      },
      location: {
        type: String,
        allowedValues: ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5', 'Case 6', 'Case 7', 'Case 8', 'Refrigerator', 'Refrigerator Closet', 'Freezer', 'Freezer-Derm', 'Drawer 2-2', 'Drawer 2-3', 'Bottom Drawer', 'Emergency Kit']
      },
      quantity: Number,
      should_have: Number,
      expirationDate: Date,
      source: String,
    }));
  }

  /**
   * Defines a new Medicine item.
   * @param lotNumber the number of the item.
   * @param name the name of the item.
   * @param type the type of the item.
   * @param location the location of the item.
   * @param quantity how many.
   * @param should_have how many should have.
   * @param expirationdate the date of expiration.
   * @param source the source of itm from.
   * @return {String} the docID of the new document.
   */
  define({ lotNumber, name, type, location, quantity, should_have, expirationDate, source }) {
    const docID = this._collection.insert({
      lotNumber,
      name,
      type,
      location,
      quantity,
      should_have,
      expirationDate,
      source,
    });
    return docID;
  }

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
      // get the MedicineCollection instance.
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
    const name = doc.name;
    const type = doc.type;
    const location = doc.location;
    const quantity = doc.quantity;
    const should_have = doc.should_have;
    const expirationDate = doc.expirationDate;
    const source = doc.source;
    return { lotNumber, name, type, location, quantity, should_have, expirationDate, source };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Medicines = new MedicineCollection();
