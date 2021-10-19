import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const medName = ['Benzonatate Capsules', 'Cetirizine Soln', 'Cold and Flu Syrup', 'Diphenhydramine 25 mg tabs',
  'Diphenhydramine Soln', 'Steroid Nasal Spray', 'Cetirizine Hydrochloride 5mg tablets', 'Cetirizine 10 mg tablets',
  'Meclizine 12.5 mg', 'Meclizine 25 mg chew tabs', 'Montelukast 10mg', 'Nasal Saline', 'NetiPot', 'Oxymetazoline (or Phenylephrine) Nasal Spray',
  'Pseudoephedrine 30 mg Tabs', 'Tussin DM Cough Syrup', 'Guaifenesin 400 mg tabs', 'Guaifenesin syrup', 'Delsym cough syrup (Dextromethorphan Polistirex)',
  'Cough Drops', 'Patient digital themometer', 'Thermometer probe covers', 'Sore Throat Spray', 'Acetaminophen 160mg/5 ml Susp', 'Acetaminophen 500 mg Caps',
  'Acetaminophen 80 mg chewable tabs', 'Acetaminophen Infant Drops', 'Allopurinol 100 mg tabs', 'Allopurinol 300 mg tabs', 'Aspirin 81 mg', 'Aspirin 325 mg',
  'Cyclobenzaprine 10 mg', 'Gabapentin 300 mg', 'Gabapentin 100 mg', 'Ibuprofen 200 mg tabs', 'Ibuprofen 800 mg tabs', 'Ibuprofen suspension 50 mg per 1.25 mL infant',
  'Ibuprofen Suspension 100 mg per 5 mL childrens', 'Indomethacin 25 mg caps', 'Indomethacin 50 mg caps', 'Kenalog 40mg/ml Injectable', 'Lidocaine Oral Topical Solution',
  'Lidocaine with Epi, injectable', 'Lidocaine w/o Epi, injectable', 'Medrol Dose Pack (Methylprednisolone 4 mg)', 'Methylprednisolone Soln',
  'Naproxen 500 mg tabs', 'Phenazopyridine Tabs', 'Prednisone 20 mg tabs', 'Tramadol 50 mg Tabs', 'Amlodipine 5 mg', 'Amlodipine 10 mg',
  'Amlodipine 5mg/ Atorvastatin 20 mg', 'Chlorthalidone or Hydrochlorothiazide 25 mg tabs', 'Furosemide 20 mg', 'Lisinopril 10 mg tab',
  'Lisinopril 20 mg tab', 'Lisinopril 5 mg tab', 'Losartan 25 mg', 'Losartan potassium 50mg', 'Metoprolol 25 mg', 'Metoprolol 50 mg', 'Nebivolol 5 mg',
  'Nebivolol 10 mg', 'Lisinopril and Hydrochlorothiazide tabs 10mg/12.5mg', 'Lisinopril and Hydrochlorothiazide tabs 20mg/12.5mg',
  'Azilsartan 80mg', 'Azilsartan/chlorthalidone 40mg/12.5mg', 'Azilsartan/chlorthalidone 40mg/25mg', 'Amoxicillin 250 mg Chewables',
  'Amoxicillin 125 mg/5ml Susp', 'Amoxicillin 250 mg/5ml Susp', 'Amoxicillin 400 mg/5ml Susp', 'Amoxicillin 500 mg Capsules',
  'Amoxicillin 875 mg Tab', 'Amoxicillin/Clavulanate 875/125 Tabs', 'Amox/Clavulanate 200/28.5/5 Susp', 'Amox/Clavulanate 400/57/5 ml Susp', 'Azithromycin 250 mg',
  'Azithromycin 200/5cc Solution', 'Ceftriaxone 500 mg Injection', 'Cephalexin 500 mg', 'Ciprofloxacin 500 mg', 'Clindamycin 300 mg',
  'Fluconazole 150 mg', 'Doxycycline/Minocycline 100 mg', 'Isoniazid 300 mg tabs', 'Ketoconazole 200 mg', 'Metronidazole 500 mg', 'Penicillin VK 250mg/5ml Soln',
  'Penicillin VK 500 mg Tabs', 'Terbinafine 250 mg Tabs', 'Trimethoprim/Sulfamethoxazole 40/200 Susp', 'Trimethroprim/Sulfamethoxazole (DS) 160/800',
  'Tamiflu 75 mg', 'Valtrex 500 mg', 'Lovastatin 20 mg', 'Simvastatin 10 mg', 'Simvastatin 20 mg', 'Simvastatin 40 mg',
  'Nitroglycerin 0.4 mg tabs', 'Bacitracin Ointment 15 gm tube', 'Bacitracin Ointment packets', 'Benzoyl Peroxide 10% Lotion',
  'Benzoyl Peroxide 10% Wash', 'Chapstick', 'Clotrimazole 1% Cream', 'Desitin/Diaper Cream', 'Hydrocotisone Cream 1%', 'Ketoconazole 2% cream',
  'Medicated Lip Ointment', 'Molefoam Padding', 'Mupirocin 2% Ointment', 'Nystatin Ointment', 'Orasol Gel 20%', 'Pain Relief Cream',
  'Permethrin 1% Shampoo', 'Permethrin 5% Cream', 'Proctosol-HC 2.5% Cream/Preparation-H', 'Salicylic Acid Pads - Corn Remover',
  'Salicylic Acid Pads - Callus Remover', 'Selenium Sulfide 2.5% Lotion', 'Silver Sulfadiazine Cream', 'Sting  Kill', 'Tolnaftate Antifungal Powder',
  'Tolnaftate 1% Cream', 'Triamcinolone 0.025% Cream', 'Triamcinolone 0.1% Cream', 'Betamethasone 0.05% Cream', 'Unna Boot 3"',
  'Unna Boot 4"', 'Urea Lotion', 'LacHydrin Lotion or Amlactin', 'White Petrolatum USP', 'Glipizide 5 mg', 'Glipizide 10 mg',
  'Glucose Tablets', 'Metformin ER 500 mg tabs', 'SGLT2 Inhibitors (Dapagliflozin 5 mg)', 'SGLT2 Inhibitors (Dapagliflozin 10 mg)', 'DPP-4 Inhibitors (Sitagliptin 100 mg)',
  'Sitagliptin/Metformin 50/500 (Janumet)', 'Sitagliptin/Metformin 100/1000 (Janumet)', 'SGLT2 Inhibitors/DPP4 Inhibitor (10mg/5mg)',
  'SGLT2 Inhibitors/DPP4 Inhibitor (25mg/5mg)', 'Alogliptin/Metformin (12.5/500)', 'Carbamide Peroxide 6.5%', 'Antipyrine & Benzocaine Otic',
  'Gentamycin, Cipro, or Ofloxacin Ophthalmic Soln', 'Artificial Tears', 'Neomycin/Polymyxin/Hydrocortisone (Cortisporin) Otic', 'Ear Plugs',
  'Napchon (Opticlear) ', 'Sulfacetamide or Polymyxin B Ophthalmic Soln', 'Ammonia Inhalant', 'Medicaine Sting/Bite Swab', 'Epipen', 'Epipen Jr.',
  'Diphenhydramine 50 mg/mL', 'Antacid', 'Bisacodyl Suppositories', 'Proton Pump Inhibitor', 'Lactulose Solution', 'Pepto-Bismol', 'Docusate Sodium 100 mg',
  'Promethazine 25 mg', 'Loperamide 2 mg', 'Ranitidine (or other H2blocker)', 'Miconazole Applicator Set',
  'Reclipsen Tabs', 'Apri Tabs', 'Depo-Provera', 'Detrol LA (Tolterodin Tartate)', 'Medroxyprogesterone 10 mg',
  'PlanB', 'Ipratropium Inhalation Soln.', 'Albuterol Inhalation Soln.', 'Albuterol HFA (Proair/Ventolin)', 'Steroid Inhaler',
  'Steroid/Long Acting Beta Agonist (Child)', 'Steroid/Long Acting Beta Agonist (Adult)', 'Tiotropium or Ipratropium', 'Ipratropium/Albuterol',
  'Buproprion ER 150 mg ', 'Nicotine Gum 2 mg', 'Nicotine Gum 4 mg', 'Nicotine Patch 7 mg', 'Nicotine Patch 14 mg', 'Nicotine Patch 21 mg', 'Multivitamins - Adult',
  'Multivitamins - Adult Gummies', 'Multivitamins - Children\'s Gummies', 'Multivitamins - Kids Chewable', 'Calcium Supplements', 'Prenatal Vitamins', 'Fiber Capsules',
  'Fluoride 0.25 mg drops', 'Fluoride .5 mg', 'Fluoride 1 mg', 'Iron 27 mg', 'Melatonin 3 mg', 'Corn removers/cushions', 'Callus cushions/removers'];

export const medType = ['Allergy and Cold Medicines', 'Analgesics/Antiinflammatory', 'Antihypertensives', 'Antimicrobials', 'Cardiac/Cholesterol',
  'Dermatologic Preparations', 'Diabetes', 'Meds', 'Ear and Eye Preparations', 'Emergency Kit', 'GI Meds', 'GYN Meds',
  'Pulmonary', 'Smoking Cessation', 'Vitamins and Supplements'];

export const medicinePublications = {
  medicine: 'Medicine',
  medicineAdmin: 'MedicineAdmin',
};

class MedicineCollection extends BaseCollection {
  constructor() {
    super('Medicines', new SimpleSchema({
      lotNumber: String,
      name: {
        type: String,
        allowedValues: medName,
      },
      type: {
        type: String,
        allowedValues: medType,
      },
      location: {
        type: String,
        allowedValues: ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5', 'Case 6', 'Case 7', 'Case 8', 'Refrigerator',
          'Refrigerator Closet', 'Freezer', 'Freezer-Derm', 'Drawer 2-2', 'Drawer 2-3', 'Bottom Drawer', 'Emergency Kit'],
      },
      quantity: Number,
      should_have: Number,
      expirationDate: Date,
      source: String,
    }));
  }

  /**
   * Defines a new Medicine item.
   * @param lotNumber the unique number of the item.
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
