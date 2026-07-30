import { prisma } from '../db/prisma';

export async function createFinTransaction(params: {
  userId: string;
  type: string;
  amount: number;
  currency: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
}) {
  const { userId, type, amount, currency, referenceType, referenceId, description } = params;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const balanceBefore = Number(user.balance);
    const balanceAfter = balanceBefore + amount;

    if (balanceAfter < 0 && type !== 'manual_adjustment') {
      throw new Error('Insufficient funds');
    }

    await tx.user.update({ where: { id: userId }, data: { balance: balanceAfter } });

    return tx.finTransaction.create({
      data: {
        user_id: userId,
        type,
        amount,
        currency,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        reference_type: referenceType,
        reference_id: referenceId,
        description,
      },
    });
  });

  return result;
}