import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Medicines } from 'MedicineCollection';
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
          (name, type, should_have, unity, form, note, owner) => {
            const docID = Medicines.define({
              name,
              type,
              should_have,
              form,
              unity,
              note,
              owner,
            });
            expect(Medicines.isDefined(docID)).to.be.true;
            Medicines.removeIt(docID);
            expect(Medicines.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const name = faker.animal.dog();
      const type = faker.animal.dog();
      const form = faker.animal.dog();
      const should_have = faker.datatype.number({ min: 1, max: 5 });
      const unity = faker.animal.dog();
      const note = faker.animal.dog();
      const owner = faker.internet.email();
      const docID1 = Medicines.define({ name, type, should_have, form, unity, note, owner });
      const docID2 = Medicines.define({ name, type, should_have, form, unity, note, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const type = faker.lorem.words();
      const form = faker.lorem.words();
      const should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const unity = faker.lorem.words();
      const note = faker.lorem.words();
      const owner = faker.lorem.words();
      const docID = Medicines.define({
        name,
        type,
        should_have,
        form,
        unity,
        note,
        owner,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(fc.integer(10), fc.lorem(2), fc.lorem(2), fc.lorem(2), fc.integer(10), fc.lorem(4),
          (newName, newType, newForm, newNote, newShould_have, newUnity) => {
            Medicines.update(docID, {
              name: newName,
              type: newType,
              form: newForm,
              note: newNote,
              should_have: newShould_have,
              unity: newUnity,
            });
            const medicine = Medicines.findDoc(docID);
            expect(medicine.name).to.equal(newName);
            expect(medicine.type).to.equal(newType);
            expect(medicine.form).to.equal(newForm);
            expect(medicine.unity).to.equal(newUnity);
            expect(medicine.should_have).to.equal(newShould_have);
            expect(medicine.note).to.equal(newNote);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Medicines.findOne({});
      let docID = origDoc._id;
      const dumpObject = Medicines.dumpOne(docID);
      Medicines.removeIt(docID);
      expect(Medicines.isDefined(docID)).to.be.false;
      docID = Medicines.restoreOne(dumpObject);
      expect(Medicines.isDefined(docID)).to.be.true;
      const doc = Medicines.findDoc(docID);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.type).to.equal(origDoc.type);
      expect(doc.form).to.equal(origDoc.form);
      expect(doc.unity).to.equal(origDoc.unity);
      expect(doc.should_have).to.equal(origDoc.should_have);
      expect(doc.note).to.equal(origDoc.note);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
