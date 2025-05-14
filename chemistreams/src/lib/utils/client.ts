"use client"

import { GenericError } from "../types/client"
import {  
    DISPLAY_NAME_MAX_LENGTH, 
    DISPLAY_NAME_MIN_LENGTH, 
    USERNAME_RULES_REGEX,
    PASSWORD_RULES_REGEX, 
    PASSWORD_MIN_LENGTH, 
    USERNAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH,
    STATUS_MAX_LENGTH,
    ALIAS_MAX_LENGTH, 
    ALIAS_MIN_LENGTH,
    ERRORS, 
} from "../constants/client"

export function isValidDisplayName(displayName: string): GenericError | undefined {
    if (displayName.length < DISPLAY_NAME_MIN_LENGTH) {
        return ERRORS.DISPLAY_NAME_MIN_LENGTH_ERROR
    }

    if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
        return ERRORS.DISPLAY_NAME_MAX_LENGTH_ERROR
    }
}

export function isValidStatus(status: string) {
    if (status.length > STATUS_MAX_LENGTH) {
        return ERRORS.STATUS_MAX_LENGTH_ERROR
    }
}

export function isValidAlias(alias: string): GenericError | undefined {
    if (alias.length < ALIAS_MIN_LENGTH) {
        return ERRORS.ALIAS_MIN_LENGTH_ERROR
    }

    if (alias.length > ALIAS_MAX_LENGTH) {
        return ERRORS.ALIAS_MAX_LENGTH_ERROR
    }
}

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

export function dateToFormat(arg1: string, arg2: Date): string
{
    let str = arg1.toLowerCase().slice()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    let mm = (str.includes('mmm') ? 'mmm' : 'mm')
    let dd = (str.includes('ddd') ? 'ddd' : 'dd')
    let yy = (str.includes('yyyy') ? 'yyyy' : 'yy')

    str = str.replace(mm, (mm === 'mm' ? (arg2.getMonth() + 1).toString().padStart(2, '0') : monthNames[arg2.getMonth()]))
    str = str.replace(dd, (dd === 'dd' ? (arg2.getDate()).toString().padStart(2, '0') : dayNames[arg2.getDay()]))
    str = str.replace(yy, (yy === 'yyyy' ? (arg2.getFullYear()).toString() : arg2.getFullYear().toString().slice(-2)))

    return str
}
