import { verifyToken } from './jwt.js';
import { User } from '../../modules/users/user.model.js';

export async function authMiddleware({ req }) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return { user: null };

  const decoded = verifyToken(token);
  if (!decoded) return { user: null };

  const user = await User.findById(decoded.id).select('-password');
  return { user };
}
