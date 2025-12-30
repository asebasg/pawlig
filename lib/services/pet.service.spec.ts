import { describe, it, expect, vi } from 'vitest';
import { getPetsWithFilters } from './pet.service';
import { prisma } from '@/lib/utils/db';

vi.mock('@/lib/utils/db', () => ({
  prisma: {
    pet: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('Pet Service - getPetsWithFilters', () => {
  it('should correctly filter pets by sex', async () => {
    const mockPets = [{ id: '1', name: 'Buddy', sex: 'Macho' }];
    (prisma.pet.findMany as vi.Mock).mockResolvedValue(mockPets);
    (prisma.pet.count as vi.Mock).mockResolvedValue(1);

    const result = await getPetsWithFilters({ sex: 'Macho' });

    expect(prisma.pet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          sex: 'Macho',
        }),
      })
    );
    expect(result.data).toEqual(mockPets);
  });
});
