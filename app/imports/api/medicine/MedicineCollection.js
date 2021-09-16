import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medicineConditions = ['excellent', 'good', 'fair', 'poor'];
export const medicinePublications = {
  medicine: 'Medicine',
  medicineAdmin: 'MedicineAdmin',
};

class MedicineCollection extends BaseCollection {
  constructor() {
    super('Stuffs', new SimpleSchema({
      lotNumber: Number,
      name: String,
      type: String,
      location: String,
      quantity: Number,
      expirationDate: String,
    }));
  }

  /**
   * Defines a new Medicine item.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @return {String} the docID of the new document.
   */
  define({ lotNumber, name, type, location, quantity, expirationDate }) {
    const docID = this._collection.insert({
      lotNumber,
      name,
      type,
      location,
      quantity,
      expirationDate,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param quantity the new quantity (optional).
   * @param condition the new condition (optional).
   */
  update(docID, { lotNumber, name, type, location, quantity, expirationDate }) {
    const updateData = {};
    if (_.isNumber(lotNumber)) {
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
    if (expirationDate) {
      updateData.expirationDate = expirationDate;
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
      // get the MedicineCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(medicinePublications.medicine, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
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
      return Meteor.subscribe(medicinePublications.stuffAdmin);
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
    const expirationDate = doc.expirationDate;
    const owner = doc.owner;
    return { lotNumber, name, type, location, quantity, expirationDate, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Medicines = new MedicineCollection();
