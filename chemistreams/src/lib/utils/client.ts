import { ERRORS, PASSWORD_MIN_LENGTH, PASSWORD_RULES_REGEX, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_RULES_REGEX } from "../constants/client"
import { GenericError } from "../types/client"

export function isValidUsername(username: string): GenericError | undefined {
    if (!USERNAME_RULES_REGEX.test(username)) {
        return ERRORS.USERNAME_SPECIAL_CHARACTER_ERROR;
    }
    if (username.length < USERNAME_MIN_LENGTH) {
        return ERRORS.USERNAME_MIN_LENGTH_ERROR;
    }
    if (username.length > USERNAME_MAX_LENGTH) {
        return ERRORS.USERNAME_MAX_LENGTH_ERROR;
    }
}

export function isValidPassword(password: string): GenericError | undefined {
    if (!PASSWORD_RULES_REGEX.test(password)) {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return ERRORS.PASSWORD_LENGTH_ERROR
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return ERRORS.PASSWORD_CAPITAL_ERROR
        }
        if (!/(?=.*[0-9])/.test(password)) {
            return ERRORS.PASSWORD_NUMBER_ERROR
        }
        if (!/(?=.*[@#?!&])/.test(password)) {
            return ERRORS.PASSWORD_SPECIAL_CHARACTER_ERROR
        }
    }
}