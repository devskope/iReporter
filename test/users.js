import { user } from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('Users', () => {
    describe('signup', () => {
      it('User creation requests missing required field returns error response', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(user.invalid)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors).to.be.an.instanceof(Array);
            done();
          });
      });

      it('Should create valid User', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(user.valid)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0]).have.own.property('user');
            expect(body.data[0]).to.have.own.property('token');
            done();
          });
      });

      it('Should not create duplicate User', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(user.valid)
          .end((err, { status }) => {
            expect(status).eq(409);
            done();
          });
      });
    });

    describe('Login', () => {
      it('should not login user with missing requirements', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send({ ...user.valid, ...{ username: undefined } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors).to.be.an.instanceof(Array);
            done();
          });
      });

      it('should not login unregistered user', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send({ ...user.valid, ...{ username: 'rougue' } })
          .end((err, { body, status }) => {
            expect(status).eq(401);
            expect(body.errors).to.be.an.instanceof(Array);
            done();
          });
      });

      it('Should log valid User in', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send(user.valid)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data[0]).have.own.property('user');
            expect(body.data[0]).to.have.own.property('token');
            done();
          });
      });
    });

    describe('Get details of a user using ID', () => {
      let authToken;

      before(done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send(user.token)
          .end((err, { body }) => {
            [{ token: authToken }] = body.data;
            done();
          });
      });

      it('Should get a username by providing a valid user ID', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/id2name/2`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should get an error response when invalid user ID supplied to fetch a username', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/id2name/6`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors).to.be.an.instanceof(Array);
            expect(body.errors[0]).to.be.a('string');
            done();
          });
      });

      it('Should get public profile details of user by ID', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/2/profile`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should get an error response when invalid user ID supplied to fetch a user profile', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/6/profile`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors).to.be.an.instanceof(Array);
            expect(body.errors[0]).to.be.a('string');
            done();
          });
      });

      it('Should fetch records of a specific user found by ID', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/2/records`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
        chai
          .request(server)
          .get(`${ROOT_URL}/user/2/records`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
        chai
          .request(server)
          .get(`${ROOT_URL}/user/2/records/red-flag/resolved`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should return error response when fetching records of a nonexistent user', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/5/records`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors).to.be.an.instanceof(Array);
            expect(body.errors[0]).to.be.a('string');
            done();
          });
      });

      it('Should return error response when  fetching nonexistent records', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/user/2/records/red-flag/rejected`)
          .set('authorization', `Bearer ${authToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors).to.be.an.instanceof(Array);
            expect(body.errors[0]).to.be.a('string');
            done();
          });
      });
    });
  });
};
