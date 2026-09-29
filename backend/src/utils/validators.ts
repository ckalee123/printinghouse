import { imageSize } from "image-size";
import fs from "fs";

export const PASSWORD_REGEX = /^(?=.{8,12}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z].*$/;
export const REGISTRATION_NUMBER_REGEX = /^\d{8}$/;
export const PIB_REGEX = /^[1-9]\d{8}$/;

export function isValidPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}

export function isValidProfileImageDimensions(filePath: string): boolean {
    const buffer = fs.readFileSync(filePath);
    const dimensions = imageSize(buffer);
    if (!dimensions.width || !dimensions.height) {
        return false;
    }
    return (
        dimensions.width >= 100 &&
        dimensions.width <= 250 &&
        dimensions.height >= 100 &&
        dimensions.height <= 250
    );
}
