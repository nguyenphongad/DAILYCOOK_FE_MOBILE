const BASE_ENDPOINT = '/api';

export const ENDPOINT = {
    // Auth endpoints
    LOGIN_GOOGLE: `${BASE_ENDPOINT}/auth/google-login`,
    CHECK_TOKEN: `${BASE_ENDPOINT}/auth/check-token`,

    // surveys endpoints
    CHECK_IS_BOARDING: `${BASE_ENDPOINT}/surveys/onboarding/status`,
    SAVE_ONBOARDING_DATA: `${BASE_ENDPOINT}/surveys/onboarding/save`,

    //meal
    GET_LIST_DIETTYPE: `${BASE_ENDPOINT}/meals/diet-types`,
    
    // dietary preferences
    GET_DIETARY_PREFERENCES: (userId) => `${BASE_ENDPOINT}/surveys/users/${userId}/dietary-preferences`,
    UPDATE_DIETARY_PREFERENCES: (userId) => `${BASE_ENDPOINT}/surveys/users/${userId}/dietary-preferences`,
    
    // nutrition goals
    CALCULATE_NUTRITION_GOALS: `${BASE_ENDPOINT}/surveys/nutrition-goals/calculate`,
    GET_NUTRITION_GOALS: `${BASE_ENDPOINT}/surveys/nutrition-goals`,

    // meal plan AI
    GENERATE_AI_MEAL_PLAN: `${BASE_ENDPOINT}/mealplans/generate-ai`,
    GET_MEAL_PLAN_FROM_CACHE: `${BASE_ENDPOINT}/mealplans/get-from-cache`,
    GET_SIMILAR_MEALS: (mealId) => `${BASE_ENDPOINT}/mealplans/similar/${mealId}`,
    REPLACE_MEAL: `${BASE_ENDPOINT}/mealplans/replace-meal`,
    SAVE_MEAL_PLAN: `${BASE_ENDPOINT}/mealplans/save`,
    GET_MEAL_PLAN_FROM_DATABASE: `${BASE_ENDPOINT}/mealplans/get-from-database`,
    TOGGLE_MEAL_EATEN: `${BASE_ENDPOINT}/mealplans/toggle-eaten`,
    GET_MEAL_HISTORY: (date) => `${BASE_ENDPOINT}/mealplans/history?date=${date}`,
    
    // meal detail
    GET_MEAL_DETAIL: (mealId) => `${BASE_ENDPOINT}/meals/meal/${mealId}`,
    
    // ingredient endpoints
    GET_INGREDIENT_DETAIL: (ingredientId) => `${BASE_ENDPOINT}/ingredients/ingredient/${ingredientId}`,
    GET_MEASUREMENT_UNITS: `${BASE_ENDPOINT}/ingredients/measurement-units`,
    
    // recipe endpoints
    GET_RECIPE_DETAIL: (recipeId) => `${BASE_ENDPOINT}/recipes/${recipeId}`,
}