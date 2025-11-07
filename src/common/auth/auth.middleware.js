import { verifyToken } from './jwt.js';
import { User } from '../../modules/users/user.model.js';

export async function authMiddleware({ req }) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) return { user: null };

  const token = authHeader.split(' ')[1];
  if (!token) return { user: null };

  const decoded = verifyToken(token);
  if (!decoded) return { user: null };

  const user = await User.findById(decoded.id).select('-password');
  return { user };
}
