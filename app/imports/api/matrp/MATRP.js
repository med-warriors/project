import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../stuff/StuffCollection';
import { SupplySource } from '../supplysource/SupplySourceCollection';
import { Patients } from '../patients/PatientCollection';
import { AdminProfiles } from '../user/AdminProfileCollection';
import { UserProfiles } from '../user/UserProfileCollection';
import { Medicines } from '../medicine/MedicineCollection';
import { MedicineSource } from '../medSource/MedicineSourceCollection';
import { MedicineSourceRecord } from '../medsourceRecord/MedicineSourceRecordCollection';
import { Supplies } from '../supply/SupplyCollection';
import { GuestProfiles } from '../user/GuestProfileCollection';
import { SupplySourceRecord } from '../supplysourceRecord/SupplySourceRecordCollection';

class MATRPClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the MATRP collections
    this.collections = [
      AdminProfiles,
      GuestProfiles,
      Stuffs,
      SupplySource,
      Patients,
      UserProfiles,
      Medicines,
      MedicineSource,
      MedicineSourceRecord,
      Supplies,
      SupplySourceRecord,
    ];
    /*
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [
      AdminProfiles,
      UserProfiles,
      GuestProfiles,
      SupplySource,
      Stuffs,
      Patients,
      Medicines,
      MedicineSource,
      MedicineSourceRecord,
      Supplies,
      SupplySourceRecord,
    ];

    /*
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });

  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    // console.log('MATRP', collectionName, this.collectionAssociation);
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called MARTP.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const MATRP = new MATRPClass();
