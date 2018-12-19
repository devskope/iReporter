import mailHelper from '../src/helpers/mailHelper';

export default ({ expect }) => {
  describe('Mailer tests', () => {
    it('Should not send an email to invalid user', () => {
      mailHelper
        .statusNotify({
          id: 1,
          created_by: 50,
          email_notify: true,
          status: 'resolved',
          type: `intervention`,
        })
        .then(success => {
          expect(success).eq(false);
        });
    });

    it('Should not send an email for record with notification turned off', () => {
      mailHelper
        .statusNotify({
          id: 1,
          created_by: 1,
          email_notify: false,
          status: 'resolved',
          type: `intervention`,
        })
        .then(success => {
          expect(success).eq(false);
        });
    });
  });
};
