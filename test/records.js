import db from '../src/db/dbrc';
import { RedFlag } from '../src/models/records';
import {
  ID,
  recordPatches,
  sampleRedFlagToAdd,
  sampleInvalidRedFlag,
} from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('Red-flag records', () => {
    describe('Creation', () => {
      it('Records missing required field returns error response', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send(sampleInvalidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq('missing required title field');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({ ...sampleInvalidRedFlag, ...{ comment: undefined } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq(
              'missing required title and comment fields'
            );
          });
      });

      it('mismatched request data types should return error', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({ ...sampleRedFlagToAdd, ...{ location: 'knowhere' } })
          .end((err, { body, status }) => {
            expect(status).eq(422);
            expect(body.errors[0]).to.be.a('string');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({
            ...sampleRedFlagToAdd,
            ...{ location: '', title: '' },
          })
          .end((err, { body, status }) => {
            expect(status).eq(422);
            expect(body.errors[0]).to.be.a('string');
          });
      });

      it('should not create records for valid requests with the wrong recordtype', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({ sampleRedFlagToAdd, ...{ type: 'wrong' } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(typeof body.errors[0]).eq('string');
          });
      });

      it('Creates a valid red-flag record', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send(sampleRedFlagToAdd)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
          });
      });
    });

    describe('Fetching', () => {
      it('Returns an empty array when no records exist', async() => {
        await db.blowAway();
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
          });
      });

      it('Should fetch all available red-flag records', async() => {
        await db.dbInit();
        await new RedFlag(sampleRedFlagToAdd).save();
        await new RedFlag(sampleRedFlagToAdd).save();
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
      });

      it('Returns a not found response when specific record ID does not exist', () => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/${ID.nonExistent}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors[0]).eq(
              `No record exists with id '${ID.nonExistent}'`
            );
          });
      });

      it('Should fetch a specific red-flag record by ID', () => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/${ID.valid}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
      });
    });

    describe('Updating', () => {
      it('Should not update record with non-existent id', () => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/${ID.nonExistent}/comment`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body).to.have.property('errors');
            expect(body).to.not.have.property('data');
          });
      });

      it('Should succesfully update location of record with valid id', () => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/${ID.valid}/location`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
          });
      });

      it('Should return success when location patch equals original', () => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/${ID.valid}/location`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
          });
      });

      it('Should succesfully update comment of record with valid id', () => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/${ID.valid}/comment`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
          });
      });

      it('Should return success when comment patch equals original', () => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/${ID.valid}/comment`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
          });
      });
    });
    describe('Deletion', () => {
      it('Should delete a record found by id', () => {
        chai
          .request(server)
          .delete(`${ROOT_URL}/red-flags/${ID.valid}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).is.an.instanceof(Array);
            expect(body.data[0]).to.have.property('message');
          });
      });
    });
  });
};
