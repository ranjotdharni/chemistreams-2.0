import { ERRORS, PASSWORD_MIN_LENGTH, PASSWORD_RULES_REGEX } from "../constants/client"
import { GenericError } from "../types/client"

export function isValidPassword(password: string): GenericError | undefined {
    if (!PASSWORD_RULES_REGEX.test(password)) {
        if (!/(?=.*[A-Z])/.test(password)) {
            return ERRORS.PASSWORD_CAPITAL_ERROR
        }
        if (!/(?=.*[0-9])/.test(password)) {
            return ERRORS.PASSWORD_NUMBER_ERROR
        }
        if (!/(?=.*[@#?!&])/.test(password)) {
            return ERRORS.PASSWORD_SPECIAL_CHARACTER_ERROR
        }
        if (password.length < PASSWORD_MIN_LENGTH) {
            return ERRORS.PASSWORD_LENGTH_ERROR
        }
    }
}