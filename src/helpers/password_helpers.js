import bcrypt from 'bcryptjs';

export const hashPass = password => bcrypt.hashSync(password);
export const passMatch = (password, hash) => bcrypt.compare(password, hash);
