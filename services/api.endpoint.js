const BASE_ENDPOINT = '/api';

export const ENDPOINT = {
    // Auth endpoints
    LOGIN_GOOGLE: `${BASE_ENDPOINT}/auth/google-login`,

    CHECK_TOKEN: `${BASE_ENDPOINT}/auth/check-token`,


    // surveys endpoints
    CHECK_IS_BOARDING: `${BASE_ENDPOINT}/surveys/onboarding/status`,
}