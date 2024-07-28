"use server";

import prisma from "../../prisma/prisma.db";
import {
  CreateTokenForUserAccountDeletionEnum,
  DeleteAccountByUserIdEnum,
} from "../enums/Account.enum";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";

/**
 * This server action will create the token for account deletion.
 *
 * if token expired it will update the token when requested.
 *
 * NOTE: mail is sent in via frontend logic using SendEmail server action
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param userId
 * @returns
 */
export async function createTokenForUserAccountDeletion(userId: string) {
  try {
    const { isUserAuthenticated } = await getCurrentUserId();

    if (!isUserAuthenticated) {
      return {
        failed: {
          data: null,
          redirect: true,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const newToken = crypto.randomUUID();

    const updatedUserWithToken = await prisma.user.update({
      where: { id: userId },
      data: {
        userAccountDeletionToken: {
          upsert: {
            where: { userId },
            create: { token: newToken },
            update: { token: newToken },
          },
        },
      },
      include: { userAccountDeletionToken: true },
    });

    return {
      success: {
        data: updatedUserWithToken,
        message: CreateTokenForUserAccountDeletionEnum.TOKEN_CREATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: CreateTokenForUserAccountDeletionEnum.FAILED_TO_CREATE_TOKEN,
      },
    };
  }
}

/**
 * This server action will delete the account.
 *
 * It seaerch the account via token
 *
 * if token is expired the account will not be deleted
 *
 * you have to request new token and again have to go through process to delete an account.
 *
 * @param token - The token for an account
 * @returns
 */
export async function deleteAccountByUserId(token: string) {
  try {
    const userAccountDeletionToken =
      await prisma.userAccountDeletionToken.findUnique({
        where: { token: token },
      });

    if (!userAccountDeletionToken) {
      return {
        failed: {
          data: null,
          message: DeleteAccountByUserIdEnum.TOKEN_NOT_FOUND,
        },
      };
    }

    const userId = userAccountDeletionToken.userId;
    const currentDate = new Date();
    const tokenExpiredIn24Hour = 1 * 24 * 60 * 60 * 1000;

    const tokenExpired =
      currentDate.getTime() >=
      userAccountDeletionToken?.createdAt.getTime() + tokenExpiredIn24Hour;

    if (tokenExpired) {
      return {
        failed: {
          data: null,
          message: DeleteAccountByUserIdEnum.TOKEN_EXPIRED,
        },
      };
    }

    const deletedAccount = await prisma.user.delete({ where: { id: userId } });

    if (deletedAccount) {
      return {
        success: {
          data: deletedAccount,
          message: DeleteAccountByUserIdEnum.ACCOUNT_DELETED,
        },
      };
    }

    return {
      failed: {
        data: null,
        message: DeleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      failed: {
        data: null,
        message: DeleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
      },
    };
  }
}
