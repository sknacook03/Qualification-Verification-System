import { all } from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const APIEndpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    loginOfficer: "/auth/login-officer",
    refresh: "/auth/refresh",
    checkTokenExpiry: "/auth/check-token-expiry",
  },
  agency: {
    checkEmail: "/agency/check-email",
    checkTelphone: "/agency/check-telphone",
    createAgency: "/agency",
    fetchAll: "/agency/agencies",
    logged: "/agency/logged-in",
    allAgencyForDropdown: "/agency/agencies-dropdown",
    verifyPassword: (agencyId) => `/agency/verify-password/${agencyId}`,
    updateAgency: (agencyId) => `/agency/update-agency/${agencyId}`,
    updateRejectAgency: (agencyId) =>
      `/agency/update-reject-agency/${agencyId}`,
    deleteAgency: (agencyId) => `/agency/delete-agency/${agencyId}`,
    latestSearch: (agencyId) => `/agency/latest-search/${agencyId}`,
  },
  passwordReset: {
    request: "/password-reset/request-reset",
    verifyCode: "/password-reset/verify-code",
    reset: "/password-reset/reset-password",
  },
  officer: {
    fetchAll: "/officer/officers",
    logged: "/officer/logged-in",
    createOfficer: "/officer",
    sendEmail: "/officer/send-email",
    verifyToken: "/officer/verify-token",
    checkOfficerEmail: "/officer/check-email",
    verifyPassword: (officerId) => `/officer/verify-password/${officerId}`,
    updateOfficer: (officerId) => `/officer/update-officer/${officerId}`,
    deleteOfficer: (officerId) => `/officer/delete-officer/${officerId}`,
  },
  typeAgency: {
    fetchAll: "/typeagency",
    createType: "/typeagency/create-type",
    fetchById: (TypeAgencyId) => `/typeagency/${TypeAgencyId}`,
    updateType: (TypeAgencyId) => `/typeagency/update-type/${TypeAgencyId}`,
    deleteType: (TypeAgencyId) => `/typeagency/delete-type/${TypeAgencyId}`,
  },
  approvalog: {
    fetchAll: "/approvedlog/logs",
    createLogs: "/approvedlog/logs",
    fetchById: (logsId) => `/approvedlog/logs/${logsId}`,
    updateById: (logsId) => `/approvedlog/logs/${logsId}`,
    deleteById: (logsId) => `/approvedlog/logs/${logsId}`,
  },
  student: {
    search: "/student/search",
    fetchById: (studentId) => `/student/${studentId}`,
    createStudent: "/student/upload-excel",
    count: "/student/count",
  },
  pageview: {
    create: "/pageview/create",
    statistics: "/pageview/statistics",
    topAgency: "/pageview/top-agencies",
    topFaculty: "/pageview/top-faculties",
    topDepartment: "/pageview/top-departments",
    trend: "/pageview/trend",
    allFaculties: "/pageview/all-faculties",
    allDepartments: "/pageview/all-departments",
    topAgenciesByFaculty: "/pageview/top-agencies-by-faculty",
    topAgenciesByDepartment: "/pageview/top-agencies-by-department",
    topAgenciesByType: "/pageview/top-agencies-by-type",
    departmentsByFaculty: "/pageview/departments-by-faculty",
    countAgencyViews: (agencyId) =>
      `/pageview/student-views-by-agency/${agencyId}`,
    logs: "/pageview/",
  },
  exportFile: {
    exportFilePDF: "/exportfile/export-pdf",
    exportFileExcel: "/exportfile/export-excel",
  },
};
