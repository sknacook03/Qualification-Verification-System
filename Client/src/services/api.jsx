export const API_BASE_URL = "http://localhost:3000";

export const APIEndpoints = {
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      loginOfficer: "/auth/login-officer",
    },
    agency: {
      checkEmail: "/agency/check-email",
      checkTelphone: "/agency/check-telphone",
      createAgency: "/agency",
      fetchAll: "/agency/agencies",
      logged: "/agency/logged-in",
      updateAgency: (agencyId) => `/agency/update-agency/${agencyId}`,
      updateRejectAgency: (agencyId) => `/agency/update-reject-agency/${agencyId}`,
      deleteAgency: (agencyId) => `/agency/delete-agency/${agencyId}`,
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
      updateStatus: (officerId) => `/officer/update-officer/${officerId}`,
      deleteOfficer: (officerId) => `/officer/delete-officer/${officerId}`,
    },
    typeAgency: {
      fetchAll: "/typeagency",
      createType: "/typeagency/create-type",
    },
    approvalog:{
      fetchAll: "/approvedlog/logs",
      createLogs: "/approvedlog/logs",
      fetchById:  (logsId) => `/approvedlog/logs/${logsId}`,
      updateById: (logsId) => `/approvedlog/logs/${logsId}`,
      deleteById: (logsId) => `/approvedlog/logs/${logsId}`,
    },
    student: {
      search: "/student/search",
    },
    pageview: {
      create: "/pageview/create"
    }
};
