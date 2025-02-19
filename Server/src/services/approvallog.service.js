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
            return await prisma.approvalLog.findUnique({ 
                where: { id: Number(id) } 
            });
        } catch (error) {
            console.error('Error fetching approval log by ID:', error);
            throw error;
        }
    },

    createApprovalLog: async (data) => {
        try {
            const now = new Date();
            const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

            return await prisma.approvalLog.create({ 
                data: { 
                    ...data, 
                    created_at: bangkokTime, 
                    updated_at: bangkokTime,  
                } 
            });
        } catch (error) {
            console.error('Error creating approval log:', error);
            throw error;
        }
    },

    updateApprovalLog: async (id, data) => {
        try {
            const now = new Date();
            const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

            return await prisma.approvalLog.update({ 
                where: { id: Number(id) }, 
                data: { 
                    ...data, 
                    updated_at: bangkokTime,  
                } 
            });
        } catch (error) {
            console.error('Error updating approval log:', error);
            throw error;
        }
    },

    deleteApprovalLog: async (id) => {
        try {
            return await prisma.approvalLog.delete({ 
                where: { id: Number(id) } 
            });
        } catch (error) {
            console.error('Error deleting approval log:', error);
            throw error;
        }
    },
};

export default ApprovalLogService;
