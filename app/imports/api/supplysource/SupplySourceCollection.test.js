import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Supplies } from './SupplySourceCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SupplyCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(1, 10), fc.lorem(1), fc.lorem(2),
          (name, quantity, owner, location) => {
            const docID = Supplies.define({
              name,
              quantity,
              owner,
              location,
            });
            expect(Supplies.isDefined(docID)).to.be.true;
            Supplies.removeIt(docID);
            expect(Supplies.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const name = faker.animal.dog();
      const location = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const owner = faker.internet.email();
      const docID1 = Supplies.define({ name, quantity, location, owner });
      const docID2 = Supplies.define({ name, quantity, location, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const location = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const owner = faker.lorem.words();
      const docID = Supplies.define({
        name,
        quantity,
        owner,
        location,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(10), fc.lorem(2),
          (newName, newQuantity, newLocation) => {
            Supplies.update(docID, {
              name: newName,
              quantity: newQuantity,
              location: newLocation,
            });
            const supply = Supplies.findDoc(docID);
            expect(supply.name).to.equal(newName);
            expect(supply.quantity).to.equal(newQuantity);
            expect(supply.location).to.equal(newLocation);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Supplies.findOne({});
      let docID = origDoc._id;
      const dumpObject = Supplies.dumpOne(docID);
      Supplies.removeIt(docID);
      expect(Supplies.isDefined(docID)).to.be.false;
      docID = Supplies.restoreOne(dumpObject);
      expect(Supplies.isDefined(docID)).to.be.true;
      const doc = Supplies.findDoc(docID);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.location).to.equal(origDoc.location);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
