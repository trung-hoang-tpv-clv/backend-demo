import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/domain/entities';

export const fakeUserData = (override?: Partial<User>): User => ({
  userId: uuidv4(),
  firstName: 'trung',
  lastName: 'hoang',
  password: '123',
  email: 'test@gmail.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  ...override,
});
