import ApprovalLogService from '../services/approvallog.service.js';

const replacer = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString(); 
    }
    return value;
};

const ApprovalLogController = {
    getAllApprovalLogs: async (req, res) => {
        try {
            const logs = await ApprovalLogService.getAllApprovalLogs();
            const responseData = JSON.parse(JSON.stringify(logs, replacer));
            res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch approval logs' });
        }
    },
    getApprovalLogById: async (req, res) => {
        try {
            const id = req.params.id;
            const log = await ApprovalLogService.getApprovalLogById(id);

            if (!log) {
                return res.status(404).json({ error: 'Approval log not found' });
            }

            const responseData = JSON.parse(JSON.stringify(log, replacer));
            res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch approval log by ID' });
        }
    },
    createApprovalLog: async (req, res) => {
        try {
            const logData = req.body;
            const newLog = await ApprovalLogService.createApprovalLog(logData);
            const responseData = JSON.parse(JSON.stringify(newLog, replacer));
            res.status(201).json({ success: true, data: responseData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create approval log' });
        }
    },
    updateApprovalLog: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No data provided for update' });
            }

            const updatedLog = await ApprovalLogService.updateApprovalLog(id, updateData);
            const responseData = JSON.parse(JSON.stringify(updatedLog, replacer));
            res.status(200).json({ success: true, message: 'Successfully updated approval log.', data: responseData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update approval log' });
        }
    },
    deleteApprovalLog: async (req, res) => {
        try {
            const { id } = req.params;
            await ApprovalLogService.deleteApprovalLog(id);
            res.status(200).json({ success: true, message: 'Approval log deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete approval log' });
        }
    },
};

export default ApprovalLogController;