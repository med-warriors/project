import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { MedicineSource } from './MedicineSourceourceCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MedicineCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.integer(1, 10), fc.lorem(2), fc.integer(1, 10), fc.lorem(2), fc.lorem(2), fc.lorem(4), fc.lorem(1),
          (lotNumber, name, quantity, should_have, type, location, expirationDate, owner) => {
            const docID = MedicineSource.define({
              lotNumber,
              name,
              type,
              location,
              quantity,
              should_have,
              expirationDate,
              owner,
            });
            expect(MedicineSource.isDefined(docID)).to.be.true;
            MedicineSource.removeIt(docID);
            expect(MedicineSource.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const lotNumber = faker.datatype.number({ min: 1, max: 5 });
      const name = faker.animal.dog();
      const type = faker.animal.dog();
      const location = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const should_have = faker.datatype.number({ min: 1, max: 5 });
      const owner = faker.internet.email();
      const expirationDate = faker.animal.dog();
      const docID1 = MedicineSource.define({ lotNumber, name, type, location, quantity, should_have, expirationDate, owner });
      const docID2 = MedicineSource.define({ lotNumber, name, type, location, quantity, should_have, expirationDate, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const lotNumber = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const name = faker.lorem.words();
      const type = faker.lorem.words();
      const location = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const expirationDate = faker.lorem.words();
      const owner = faker.lorem.words();
      const docID = MedicineSource.define({
        lotNumber,
        name,
        type,
        location,
        quantity,
        should_have,
        expirationDate,
        owner,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(fc.integer(10), fc.lorem(2), fc.lorem(2), fc.lorem(2), fc.integer(10), fc.lorem(4),
          (newLotNumber, newName, newType, newLocation, newQuantity, newShould_have, newExpirationDate) => {
            MedicineSource.update(docID, {
              lotNumber: newLotNumber,
              name: newName,
              type: newType,
              location: newLocation,
              quantity: newQuantity,
              should_have: newShould_have,
              expirationDate: newExpirationDate,
            });
            const medicine = MedicineSource.findDoc(docID);
            expect(medicine.lotNumber).to.equal(newLotNumber);
            expect(medicine.name).to.equal(newName);
            expect(medicine.type).to.equal(newType);
            expect(medicine.location).to.equal(newLocation);
            expect(medicine.quantity).to.equal(newQuantity);
            expect(medicine.should_have).to.equal(newShould_have);
            expect(medicine.expirationDate).to.equal(newExpirationDate);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = MedicineSource.findOne({});
      let docID = origDoc._id;
      const dumpObject = MedicineSource.dumpOne(docID);
      MedicineSource.removeIt(docID);
      expect(MedicineSource.isDefined(docID)).to.be.false;
      docID = MedicineSource.restoreOne(dumpObject);
      expect(MedicineSource.isDefined(docID)).to.be.true;
      const doc = MedicineSource.findDoc(docID);
      expect(doc.lotNumber).to.equal(origDoc.lotNumber);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.type).to.equal(origDoc.type);
      expect(doc.location).to.equal(origDoc.location);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.should_have).to.equal(origDoc.should_have);
      expect(doc.expirationDate).to.equal(origDoc.expirationDate);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
