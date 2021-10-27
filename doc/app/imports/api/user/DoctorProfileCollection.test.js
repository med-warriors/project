import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { DoctorProfiles } from './DoctorProfileCollection';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DoctorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem({ maxCount: 1 }), fc.lorem({ maxCount: 1 }),
          (firstName, lastName) => {
            const email = faker.internet.email();
            const docID = DoctorProfiles.define({ email, firstName, lastName });
            expect(DoctorProfiles.isDefined(docID)).to.be.true;
            DoctorProfiles.removeIt(docID);
            expect(DoctorProfiles.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const docID1 = DoctorProfiles.define({ email, firstName, lastName });
      const docID2 = DoctorProfiles.define({ email, firstName, lastName });
      expect(docID1).to.equal(docID2);
    });

    it('Can update', function test3(done) {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const password = faker.internet.password();
      const docID = DoctorProfiles.define({ email, firstName, lastName, password });
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), (fName, lName) => {
          DoctorProfiles.update(docID, { firstName: fName, lastName: lName });
          const doctor = DoctorProfiles.findDoc(docID);
          expect(doctor.firstName).to.equal(fName);
          expect(doctor.lastName).to.equal(lName);
        }),
      );
      done();
    });
  });
}
