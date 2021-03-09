import { Context } from '../apollo';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { User, UserModel } from '../entities/User';
import argon2 from 'argon2';
import { v4 } from 'uuid';
import { SESSION_COOKIE, REGISTER_ENABLED } from '../env';

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [String], { nullable: true })
  errors?: string[];
}

@ObjectType()
export class RegisterResponseError {
  @Field()
  field: string;

  @Field()
  error: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [RegisterResponseError], { nullable: true })
  errors?: RegisterResponseError[];
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await UserModel.get({ id: req.session.userId });
    return user;
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Ctx() { req }: Context,
    @Arg('username') username: string,
    @Arg('password') password: string,
  ): Promise<RegisterResponse> {
    if (!REGISTER_ENABLED) {
      return {
        errors: [
          {
            field: 'username',
            error: 'Registration is disabled.',
          },
        ],
      };
    }
    if (username.length < 3 || username.length > 12) {
      return {
        errors: [
          {
            field: 'username',
            error: 'Username length must be between 3 and 12 characters long.',
          },
        ],
      };
    }
    if (password.length < 3 || password.length > 32) {
      return {
        errors: [
          {
            field: 'password',
            error: 'Password length must be between 3 and 32 characters long.',
          },
        ],
      };
    }
    const userQuery = await UserModel.query('username').eq(username).exec();
    if (userQuery.count > 0) {
      return {
        errors: [
          {
            field: 'username',
            error: 'Username is not available.',
          },
        ],
      };
    }
    const passwordHash = await argon2.hash(password);
    const user = new UserModel({
      id: v4(),
      username,
      password: passwordHash,
    });
    await user.save();
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Ctx() { req }: Context,
    @Arg('username') username: string,
    @Arg('password') password: string,
  ): Promise<LoginResponse> {
    const userQuery = await UserModel.query('username').eq(username).exec();
    if (userQuery.count === 0) {
      return {
        errors: ['Invalid login.'],
      };
    }
    const user = userQuery[0];
    console.log(user);
    if (!(await argon2.verify(user.password, password))) {
      return {
        errors: ['Invalid login.'],
      };
    }
    req.session.userId = user.id;
    req.session.name = user.username;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(SESSION_COOKIE);
        resolve(!err);
      });
    });
  }
}