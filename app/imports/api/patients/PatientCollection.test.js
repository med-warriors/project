import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Patients } from './PatientCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('PatientCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(1, 10), fc.lorem(1),
          (date, id) => {
            const docID = Patients.define({
              date,
              id,
            });
            expect(Patients.isDefined(docID)).to.be.true;
            Patients.removeIt(docID);
            expect(Patients.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const date = faker.animal.dog();
      const id = faker.animal.dog();
      const docID1 = Patients.define({ date, id });
      const docID2 = Patients.define({ date, id });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const date = faker.lorem.words();
      const id = faker.lorem.words();
      const docID = Patients.define({
        date,
        id,
      });
      fc.assert(
        fc.property(fc.integer(10), fc.integer(10)),
        (newDate, newId) => {
          Patients.update(docID, {
            date: newDate,
            id: newId,
          });
          const patient = Patients.findDoc(docID);
          expect(patient.date).to.equal(newDate);
          expect(patient.id).to.equal(newId);
        },
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Patients.findOne({});
      let docID = origDoc._id;
      const dumpObject = Patients.dumpOne(docID);
      Patients.removeIt(docID);
      expect(Patients.isDefined(docID)).to.be.false;
      docID = Patients.restoreOne(dumpObject);
      expect(Patients.isDefined(docID)).to.be.true;
      const doc = Patients.findDoc(docID);
      expect(doc.date).to.equal(origDoc.date);
      expect(doc.id).to.equal(origDoc.id);
    });
  });
}
