import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ApprovalLogService = {
    getAllApprovalLogs: async () => {
        try {
            return await prisma.approvalLog.findMany();
        } catch (error) {
            console.error('Error fetching approval logs:', error);
            throw error;
        }
    },
    getApprovalLogById: async (id) => {
        try {
            return await prisma.approvalLog.findUnique({ where: { id: BigInt(id) } });
        } catch (error) {
            console.error('Error fetching approval log by ID:', error);
            throw error;
        }
    },
    createApprovalLog: async (data) => {
        try {
            return await prisma.approvalLog.create({ data });
        } catch (error) {
            console.error('Error creating approval log:', error);
            throw error;
        }
    },
    updateApprovalLog: async (id, data) => {
        try {
            return await prisma.approvalLog.update({ where: { id: BigInt(id) }, data });
        } catch (error) {
            console.error('Error updating approval log:', error);
            throw error;
        }
    },
    deleteApprovalLog: async (id) => {
        try {
            return await prisma.approvalLog.delete({ where: { id: BigInt(id) } });
        } catch (error) {
            console.error('Error deleting approval log:', error);
            throw error;
        }
    },
};

export default ApprovalLogService;