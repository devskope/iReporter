import mailer from '@sendgrid/mail';
import debug from 'debug';
import env from '../config/envConf';
import { User } from '../models/users';

const logger = debug('iReporter::mailer');

mailer.setApiKey(env.SENDGRID_KEY);

const statusNotify = ({
  id,
  created_by: userID,
  email_notify: notify,
  status,
  type,
}) =>
  notify
    ? User.findByID(userID).then(({ rowCount, rows }) => {
        let success;
        if (rowCount > 0) {
          const [{ firstname: name, email: userEmail }] = rows;

          const statusUpdateMail = {
            to: userEmail,
            from: 'noreply@ireporter.info',
            subject: 'iReporter record status update',
            text: `Hi ${name}, the status of your ${type} record(#${id}) was just changed to ${status}.`,
            html: `Hi <strong>${name}</strong>, 
              <p>The status of your ${type} record <strong>#${id}</strong> was just changed to ${status}.`,
          };

          mailer.send(statusUpdateMail).catch(e => {
            logger(e.toString());
            success = false;
          });
        } else {
          logger(`Can't find record creator`);
          success = false;
        }
        return success;
      })
    : Promise.resolve(
        (() => {
          logger(`skipping email notification for ${type} #${id}`);
          return false;
        })()
      );

export default { statusNotify };
