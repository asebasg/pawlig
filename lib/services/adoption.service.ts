import { prisma } from '@/lib/utils/db';

export type AdoptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface AdoptionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export async function getUserAdoptions(userId: string, status?: AdoptionStatus) {
  return await prisma.adoption.findMany({
    where: {
      adopterId: userId,
      ...(status && { status }),
    },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          images: true,
          breed: true,
          status: true,
        },
      },
      shelter: {
        select: {
          id: true,
          name: true,
          contactWhatsApp: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getAdoptionById(id: string) {
  return await prisma.adoption.findUnique({
    where: { id },
    include: {
      pet: true,
      shelter: true,
    },
  });
}

export async function getAdoptionStats(userId: string): Promise<AdoptionStats> {
  const adoptions = await prisma.adoption.findMany({
    where: { adopterId: userId },
    select: { status: true },
  });

  return {
    total: adoptions.length,
    pending: adoptions.filter(a => a.status === 'PENDING').length,
    approved: adoptions.filter(a => a.status === 'APPROVED').length,
    rejected: adoptions.filter(a => a.status === 'REJECTED').length,
  };
}
