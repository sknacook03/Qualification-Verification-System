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
      register: "/agency",
      fetchAll: "/agency/agencies",
      typeAgency: "/typeagency",
      updateStatus: (agencyId) => `/agency/update-agency/${agencyId}`,
    },
    passwordReset: {
      request: "/password-reset/request-reset",
      verifyCode: "/password-reset/verify-code",
      reset: "/password-reset/reset-password",
    },
    officerEmail: {
      send: "/officer/send-email",
    },
};
