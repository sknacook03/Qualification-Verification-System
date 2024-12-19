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
      updateStatus: (agencyId) => `/agency/update-agency/${agencyId}`,
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
      updateStatus: (officerId) => `/officer/update-officer/${officerId}`,
      deleteOfficer: (officerId) => `/officer/delete-officer/${officerId}`,
      sendEmail: "/officer/send-email",
    },
    typeAgency: {
      fetchAll: "/typeagency",
      createType: "/typeagency/create-type",
    }
    
};
