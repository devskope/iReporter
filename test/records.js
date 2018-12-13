import { recordPatches, records, user } from './helpers';
import env from '../src/config/envConf';

export default ({ server, chai, expect, ROOT_URL }) => {
  let authToken;
  let adminToken;
  describe('Red-flag records', () => {
    before(done => {
      chai
        .request(server)
        .post(`${ROOT_URL}/auth/login`)
        .send(env.ADMIN)
        .end((err, { body }) => {
          [{ token: adminToken }] = body.data;
        });
      chai
        .request(server)
        .post(`${ROOT_URL}/auth/login`)
        .send(user.token)
        .end((err, { body }) => {
          [{ token: authToken }] = body.data;
          done();
        });
    });

    describe('Fetching before creation', () => {
      it('Returns an empty array when no records exist', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            done();
          });
      });

      it('Returns a not found response when specific record ID does not exist', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/10`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors[0]).eq(`No red-flag record exists with id '10'`);
            done();
          });
      });
    });

    describe('Creation', () => {
      it('Records missing required field returns error response', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleInvalidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq('missing required title field');
            done();
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send({ ...records.sampleInvalidRedFlag, ...{ comment: undefined } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq(
              'missing required title and comment fields'
            );
          });
      });

      it('mismatched request data types should return error', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send({ ...records.sampleValidRedFlag, ...{ location: 'knowhere' } })
          .end((err, { body, status }) => {
            expect(status).eq(422);
            expect(body.errors[0]).to.be.a('string');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send({
            ...records.sampleValidRedFlag,
            ...{ location: '', title: '' },
          })
          .end((err, { body, status }) => {
            expect(status).eq(422);
            expect(body.errors[0]).to.be.a('string');
            done();
          });
      });

      it('should not create records for valid requests with the wrong record type', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send({ ...records.sampleValidRedFlag, ...{ type: 'wrong' } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(typeof body.errors[0]).eq('string');
            done();
          });
      });

      it('Creates a valid red-flag records', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleValidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleValidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleValidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleValidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
            done();
          });
      });
    });

    describe('Fetching after creation', () => {
      it('Should fetch all available red-flag records', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should fetch a specific red-flag record by ID', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/1`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });
    });

    describe('Updating', () => {
      it('Should not update record with non-existent id', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/10/comment`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body).to.have.property('errors');
            expect(body).to.not.have.property('data');
            done();
          });
      });

      it("Should not update comment of other's records", done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/comment`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(403);
            expect(body).to.have.property('errors');
            done();
          });
      });

      it("Should not update location of other's records", done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/location`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(403);
            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Should succesfully update location of record with valid id', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/location`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });

      it('Should return success when location patch equals original', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/location`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { status }) => {
            expect(status).eq(304);
            done();
          });
      });

      it('Should succesfully update comment of record with valid id', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/comment`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });

      it('Should return success when comment patch equals original', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/red-flags/1/comment`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { status }) => {
            expect(status).eq(304);
            done();
          });
      });
    });
    describe('Deletion', () => {
      it("Should not delete other's records", done => {
        chai
          .request(server)
          .delete(`${ROOT_URL}/red-flags/1`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, { status }) => {
            expect(status).eq(403);
            done();
          });
      });

      it('Should delete a record found by id', done => {
        chai
          .request(server)
          .delete(`${ROOT_URL}/red-flags/1`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).is.an.instanceof(Array);
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });
    });
  });

  describe('Interventions', () => {
    describe('Creation', () => {
      it('should not create records for valid requests with the wrong recordtype', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/interventions`)
          .set('authorization', `Bearer ${authToken}`)
          .send({ ...records.sampleInterventionToAdd, ...{ type: 'red-flag' } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(typeof body.errors[0]).eq('string');
            done();
          });
      });

      it('Creates a valid intervention record', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/interventions`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleIntervention)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created Intervention record');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/interventions`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleIntervention)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created Intervention record');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/interventions`)
          .set('authorization', `Bearer ${authToken}`)
          .send(records.sampleIntervention)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created Intervention record');
            done();
          });
      });
    });

    describe('Fetching', () => {
      it('Should fetch all available intervention records', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/interventions/`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should fetch a specific intervention record by ID', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/interventions/6`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });
    });

    describe('Updating', () => {
      it("Should not update comment of other's records", done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/comment`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(403);
            expect(body).to.have.property('errors');
            done();
          });
      });

      it("Should not update location of other's records", done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/location`)
          .set('authorization', `Bearer ${adminToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(403);
            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Should succesfully update comment of record with valid id', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/comment`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });

      it('Should return success when comment patch equals original', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/comment`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { status }) => {
            expect(status).eq(304);
            done();
          });
      });

      it('Should succesfully update location of record with valid id', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/location`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body).to.have.property('data');
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });

      it('Should return success when location patch equals original', done => {
        chai
          .request(server)
          .patch(`${ROOT_URL}/interventions/6/location`)
          .set('authorization', `Bearer ${authToken}`)
          .send(recordPatches)
          .end((err, { status }) => {
            expect(status).eq(304);
            done();
          });
      });
    });

    describe('Deletion', () => {
      it("Should not delete other's records", done => {
        chai
          .request(server)
          .delete(`${ROOT_URL}/interventions/6`)
          .set('authorization', `Bearer ${adminToken}`)
          .end((err, { status }) => {
            expect(status).eq(403);
            done();
          });
      });

      it('Should delete a record found by id', done => {
        chai
          .request(server)
          .delete(`${ROOT_URL}/interventions/6`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).is.an.instanceof(Array);
            expect(body.data[0]).to.have.property('message');
            done();
          });
      });
    });
  });

  describe('Order Status mutations', () => {
    it('Non-admin should not mutate record status', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/interventions/5/status`)
        .set('authorization', `Bearer ${authToken}`)
        .send(recordPatches)
        .end((err, { body, status }) => {
          expect(status).eq(401);
          expect(body).to.have.property('errors');
          expect(body.errors[0]).eq(
            'you do not have sufficient privileges to access the requested resouce'
          );
          done();
        });
    });

    it('Admin should not set an invalid status', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/red-flags/2/status`)
        .set('authorization', `Bearer ${adminToken}`)
        .send({ status: recordPatches.invalidStatus })
        .end((err, { body, status }) => {
          expect(status).eq(422);
          expect(body).to.have.property('errors');
          expect(body.errors[0]).eq(
            `cannot parse invalid status "${recordPatches.invalidStatus}".`
          );
          done();
        });
    });

    it('Admin can mutate record status', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/red-flags/2/status`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(recordPatches)
        .end((err, { body, status }) => {
          expect(status).eq(200);
          expect(body).to.have.property('data');
          expect(body.data[0]).to.have.property('message');
          done();
        });
    });

    it('Updated record should be sent along with response body on successful update', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/interventions/5/status`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(recordPatches)
        .end((err, { body, status }) => {
          expect(status).eq(200);
          expect(body).to.have.property('data');
          expect(body.data[0].record.status).eq(recordPatches.status);
          done();
        });
    });

    it('Should not modify record when status to set is already set', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/interventions/5/status`)
        .set('authorization', `Bearer ${adminToken}`)
        .send(recordPatches)
        .end((err, { status }) => {
          expect(status).eq(304);
          done();
        });
    });

    it('Should not modify record location/comment when record status has been mutated', done => {
      chai
        .request(server)
        .patch(`${ROOT_URL}/red-flags/2/location`)
        .set('authorization', `Bearer ${authToken}`)
        .send(records.sampleValidRedFlag)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
        });

      chai
        .request(server)
        .patch(`${ROOT_URL}/red-flags/2/comment`)
        .set('authorization', `Bearer ${authToken}`)
        .send(records.sampleValidRedFlag)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
        });

      chai
        .request(server)
        .patch(`${ROOT_URL}/interventions/5/location`)
        .set('authorization', `Bearer ${authToken}`)
        .send(records.sampleIntervention)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
        });

      chai
        .request(server)
        .patch(`${ROOT_URL}/interventions/5/comment`)
        .set('authorization', `Bearer ${authToken}`)
        .send(records.sampleIntervention)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
          done();
        });
    });

    it('Should not delete record when record status has been mutated', done => {
      chai
        .request(server)
        .delete(`${ROOT_URL}/red-flags/2`)
        .set('authorization', `Bearer ${authToken}`)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
        });

      chai
        .request(server)
        .delete(`${ROOT_URL}/interventions/5`)
        .set('authorization', `Bearer ${authToken}`)
        .end((err, { body, status }) => {
          expect(status).eq(403);
          expect(body.errors).is.an.instanceof(Array);
          done();
        });
    });
  });
};
