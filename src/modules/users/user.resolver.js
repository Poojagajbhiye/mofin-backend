import { User } from './user.model.js';
import { signToken } from '../../common/auth/jwt.js';
import bcrypt from 'bcryptjs';

export const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
  },
  Mutation: {
    register: async (_, { name, email, password, parentId }, { user }) => {
      // Only admin/main user can create sub-accounts
      if (parentId) {
        if (!user) throw new Error('Not authenticated');
        if (user.role !== 'admin') throw new Error('Only main account can create sub-accounts');
      }

      const existing = await User.findOne({ email });
      if (existing) throw new Error('User already exists');

      const newUser = new User({ name, email, password, role: parentId ? 'member' : 'admin', parentId: parentId || null });
      await newUser.save();

      const token = signToken({ id: newUser._id });
      return { token, user: newUser };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = signToken({ id: user._id });
      return { token, user };
    },
  },
};
