const BASE_ENDPOINT = '/api';

export const ENDPOINT = {
    // Auth endpoints
    LOGIN_GOOGLE: `${BASE_ENDPOINT}/auth/google-login`,

    CHECK_TOKEN: `${BASE_ENDPOINT}/auth/check-token`,


    // surveys endpoints
    CHECK_IS_BOARDING: `${BASE_ENDPOINT}/surveys/onboarding/status`,
    SAVE_ONBOARDING_DATA: `${BASE_ENDPOINT}/surveys/onboarding/save`,


    //meal
    GET_LIST_DIETTYPE   : `${BASE_ENDPOINT}/meals/diet-types`,
    
    // dietary preferences
    GET_DIETARY_PREFERENCES: (userId) => `${BASE_ENDPOINT}/surveys/users/${userId}/dietary-preferences`,
    UPDATE_DIETARY_PREFERENCES: (userId) => `${BASE_ENDPOINT}/surveys/users/${userId}/dietary-preferences`,
    
    // nutrition goals
    CALCULATE_NUTRITION_GOALS: `${BASE_ENDPOINT}/surveys/nutrition-goals/calculate`,
    GET_NUTRITION_GOALS: `${BASE_ENDPOINT}/surveys/nutrition-goals`,
}