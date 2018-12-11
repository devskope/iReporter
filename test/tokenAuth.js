import { user, token } from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('token based Auth', () => {
    describe('No token', () => {
      it('Should not access protected route without token', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .end((err, { status, body }) => {
            expect(status).eq(401);
            expect(body.errors[0]).eq('Unauthorized! No token provided.');
            done();
          });
      });
    });

    describe('Invalid / Unbound token', () => {
      it('Should not access protected route with malformed token', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/interventions`)
          .set('Authorization', `Bearer ${token.invalid}`)
          .end((err, { status, body }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq('jwt malformed');
            done();
          });
      });

      it('Should not access protected route with unbound token', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${token.unbound}`)
          .end((err, { status, body }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq(
              `Ooops something happened, can't find User`
            );
            done();
          });
      });
    });

    describe('Valid token', () => {
      let validToken;
      before(done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(user.token)
          .end((err, { body }) => {
            [{ token: validToken }] = body.data;
            done();
          });
      });

      it('Should access protected route with valid token', done => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .set('authorization', `Bearer ${validToken}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            done();
          });
      });
    });
  });
};
