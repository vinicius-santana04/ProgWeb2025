import { PrismaClient, Major } from '@prisma/client'
import { CreateMajorDto, UpdateMajorDto } from '../types/major.types'

const prisma = new PrismaClient()

export const getAllMajors = async(): Promise<Major[]> => {
    return prisma.major.findMany();
}

export const getMajorByCode = async (code: string): Promise<Major | null> => {
    return prisma.major.findUnique({
        where: { code }
    });
};

export const getMajorById = async (id: string): Promise<Major | null> => {
    return prisma.major.findUnique({
        where: { id }
    });
};

export const createMajor = async ( newMajor: CreateMajorDto ): Promise<Major> => {
    return await prisma.major.create({ data: newMajor })
}

export const updateMajor = async (id: string, data: UpdateMajorDto): Promise<Major> => {
    return await prisma.major.update({
        where: { id },
        data
    });
};

export const deleteMajor = async (id: string): Promise<Major> => {
    return await prisma.major.delete({
        where: { id }
    });
};

export const countUsersInMajor = async (majorId: string): Promise<number> => {
    return prisma.user.count({
        where: { majorId }
    });
};