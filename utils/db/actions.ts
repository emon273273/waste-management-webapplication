import { db } from "./dbConfig";

import { Notification, Transaction, Users } from "./schema";

import { eq, sql, and, desc } from "drizzle-orm";

export async function createUser(email: string, name: string) {
  try {
    const [user] = await db
      .insert(Users)
      .values({ email, name })
      .returning()
      .execute();
    return user;
  } catch (e) {
    console.log("error creating user", e);
    return null;
  }
}

//userinfoByEmail

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();
    return user;
  } catch (e) {
    console.log("error loading user by email", e);
    return null;
  }
}

export async function getUnreadNotification(userId: number) {
  try {
    return await db
      .select()
      .from(Notification)
      .where(
        and(eq(Notification.userId, userId), eq(Notification.isRead, false))
      )
      .execute();
  } catch (e) {
    console.log("Error fetching unread Notification", e);
  }
}

//get user balacne

export async function getUserBalance(UserId: number) {
  const transactions = (await getRewardTransactions(UserId)) || [];

  if (!transactions) return 0;
  const balance = transactions.reduce((acc: number, transaction: any) => {
    return transaction.type.startWith("earned")
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  return Math.max(balance, 0);
}

//gertreward trancastion

export async function getRewardTransactions(userId: number) {
  try {
    const transactions = await db
      .select({
        id: Transaction.id,

        type: Transaction.type,

        amount: Transaction.amount,
        description: Transaction.description,
        date: Transaction.date,
      })
      .from(Transaction)
      .where(eq(Transaction.userId, userId))
      .orderBy(desc(Transaction.date))
      .limit(10)
      .execute();

    const formattedTransactions = transactions.map((t) => ({
      ...t,
      date: t.date.toISOString().split("T")[0], //yyyy-mm-dd
    }));

    return formattedTransactions;
  } catch (e) {
    console.log("error fetching reward transactions", e);
    return null;
  }
}
