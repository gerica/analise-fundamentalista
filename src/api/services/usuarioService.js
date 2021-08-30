/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { schemaComposer, toInputObjectType } from 'graphql-compose';
import UtilCrypt from '../../utils/crypt.js';
import logger from '../../utils/logger.js';
import { UsuarioTC } from '../models/usuario.js';

class UserService {
  constructor() {
    this.initQueries();
    this.initMutations();
  }

  initQueries() {
    this.query = {
      userById: UsuarioTC.getResolver('findById', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userByIds: UsuarioTC.getResolver('findByIds', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userOne: UsuarioTC.getResolver('findOne', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userMany: UsuarioTC.getResolver('findMany', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userCount: UsuarioTC.getResolver('count', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userConnection: UsuarioTC.getResolver('connection', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
      userPagination: UsuarioTC.getResolver('pagination', [UtilCrypt.authMiddleware, UtilCrypt.deletedMiddleware]),
    };
  }

  initMutations() {
    this.mutation = {
      userRegister: this.getUserRegister(),
      userLogin: this.getUserLogin(),
      userChangePassword: this.getUserChangePassword(),
      userResetPassword: this.getUserResetPassword(),
      // userCreateOne: UserTC.getResolver('createOne'),
      // userCreateMany: UserTC.getResolver('createMany'),
      userUpdateById: UsuarioTC.getResolver('updateById', [UtilCrypt.authMiddleware, UserService.saveImageByMiddleware]),
      userUpdateOne: UsuarioTC.getResolver('updateOne', [UtilCrypt.authMiddleware, UserService.saveImageByMiddleware]),
      // userUpdateMany: UsuarioTC.getResolver('updateMany', [UtilCrypt.authMiddleware]),
      // userRemoveById: UserTC.getResolver('removeById'),
      // userRemoveOne: UserTC.getResolver('removeOne'),
      // userRemoveMany: UserTC.getResolver('removeMany'),
    };
    this.mutationInner = {
      userCreateOne: UsuarioTC.getResolver('createOne'),
    };
  }

  getUserRegister() {
    const userRegisterRecordTC = schemaComposer.createObjectTC({
      name: 'userRegisterRecord',
      fields: {
        nome: 'String',
        email: 'String',
        senha: 'String',
      },
    });

    const userRegisterRecordITC = toInputObjectType(userRegisterRecordTC);

    return schemaComposer.createResolver({
      name: 'userRegister',
      type: 'String',
      args: { record: userRegisterRecordITC },
      resolve: async (payload) => {
        logger.info('✅ Resolver: userRegister');
        const result = await this.register(payload);
        return result;
      },
    });
  }

  getUserLogin() {
    const userLoginRecordTC = schemaComposer.createObjectTC({
      name: 'userLoginRecordTC',
      fields: {
        email: 'String',
        senha: 'String',
      },
    });

    const UserLoginTC = schemaComposer.createObjectTC({
      name: 'UserLogin',
      fields: {
        ...UsuarioTC._gqcFields,
        token: 'String',
      },
    });

    const userLoginRecordITC = toInputObjectType(userLoginRecordTC);

    return schemaComposer.createResolver({
      name: 'userLogin',
      type: UserLoginTC,
      args: { record: userLoginRecordITC },
      resolve: async (payload) => {
        logger.info('✅ Resolver: userLogin');
        const result = await this.login(payload);
        return result;
      },
    });
  }

  getUserChangePassword() {
    const recordTC = schemaComposer.createObjectTC({
      name: 'userChangePasswordRecordTC',
      fields: {
        senhaAntiga: 'String',
        senhaNova: 'String',
      },
    });

    const inputITC = toInputObjectType(recordTC);

    return schemaComposer.createResolver({
      name: 'userChangePassword',
      type: 'String',
      args: { record: inputITC },
      resolve: async (payload) => {
        logger.info('✅ Resolver: userChangePassword');
        const result = await this.changePassword(payload);
        return result;
      },
    });
  }

  getUserResetPassword() {
    return schemaComposer.createResolver({
      name: 'userResetPassword',
      type: 'String',
      args: { email: 'String' },
      resolve: async (payload) => {
        logger.info('✅ Resolver: userResetPassword');
        const result = await this.resetPassword(payload);
        return result;
      },
    });
  }

  async register(payload) {
    logger.info('✅ UserService: register');
    const result = 'Success';
    const { args } = payload;
    const {
      record: { senha },
    } = args;
    const { email } = args.record;
    // const password = UtilCrypt.genPassword();

    try {
      await this.checkUserExist(payload, email);
      const newUser = {
        ...args.record,
        senha: await UtilCrypt.encryptPassword(senha),
      };
      await this.createUser(payload, newUser);

      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async createUser({ context, info }, body) {
    return this.mutationInner.userCreateOne.resolve({
      args: {
        record: body,
      },
      context,
      info,
    });
  }

  async checkUserExist(payload, email) {
    const userExist = await this.findOne(payload, { email });
    if (userExist) {
      throw new AuthenticationError('User Already Exists!');
    }
  }

  async findOne({ context, info }, params) {
    const findOneResolve = UsuarioTC.getResolver('findOne');
    return findOneResolve.resolve({ args: { filter: params }, context, info });
  }

  async login({ context, info, args }) {
    logger.info('✅ UserService:login');
    const { record } = args;
    const { email, password } = record;
    const user = await this.findOne({ context, info }, { email });
    const isMatch = await UtilCrypt.comparePassword(password, user.password);

    if (isMatch) {
      user.token = UtilCrypt.getToken(user.toObject());
      return user;
    }
    throw new AuthenticationError('Wrong Password!');
  }

  async findByEmail(payload, email) {
    const user = await this.findOne(payload, { email });
    if (!user) {
      throw new UserInputError("The user with this email doesn't exist");
    }
    return user;
  }

  async resetPassword({ context, info, args }) {
    logger.info('✅ UserService: resetPassword');
    const result = 'Success';

    const { email } = args;
    const userBd = await this.findOne({ context, info }, { email });
    if (!userBd) {
      throw new UserInputError("Don't exist user with this e-mail!");
    }

    const password = UtilCrypt.genPassword();
    userBd.confirmed = false;
    userBd.updatedAt = new Date();
    userBd.password = await UtilCrypt.encryptPassword(password);

    const { _id } = userBd;
    const updateResolver = UsuarioTC.getResolver('updateById');
    await updateResolver.resolve({
      context,
      info,
      args: {
        _id,
        record: { ...userBd.toObject() },
      },
    });

    return result;
  }

  async changePassword({ context, info, args }) {
    logger.info('✅ UserService: changePassword');
    const { user } = context;
    if (!user) {
      throw new AuthenticationError('User is required, maybe the token is invalid!');
    }
    const { oldPassword, newPassword } = args.record;
    const { _id } = user;
    const userBd = await this.findOne({ context, info }, { _id });

    const isMatch = await UtilCrypt.comparePassword(oldPassword, userBd.password);
    if (isMatch) {
      userBd.confirmed = true;
      userBd.updatedAt = new Date();
      userBd.password = await UtilCrypt.encryptPassword(newPassword);
      const updateResolver = UsuarioTC.getResolver('updateById');
      await updateResolver.resolve({
        context,
        info,
        args: {
          _id,
          record: { ...userBd.toObject() },
        },
      });

      return UtilCrypt.getToken(userBd.toObject());
    }
    throw new AuthenticationError('Wrong Password!');
  }
}
export default UserService;
