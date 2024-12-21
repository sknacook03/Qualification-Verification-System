import express from 'express';
import ApprovalLogController from '../controllers/approvallog.controller.js';

const ApprovalLogRouter = express.Router();

ApprovalLogRouter.get('/logs', ApprovalLogController.getAllApprovalLogs);
ApprovalLogRouter.get('/logs/:id', ApprovalLogController.getApprovalLogById);
ApprovalLogRouter.post('/logs', ApprovalLogController.createApprovalLog);
ApprovalLogRouter.put('/logs/:id', ApprovalLogController.updateApprovalLog);
ApprovalLogRouter.delete('/logs/:id', ApprovalLogController.deleteApprovalLog);

export default ApprovalLogRouter;