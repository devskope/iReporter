import bcrypt from 'bcryptjs';

export const hashPass = password => bcrypt.hashSync(password);
