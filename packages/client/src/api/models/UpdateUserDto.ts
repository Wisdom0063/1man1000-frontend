/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
    name?: string;
    company?: string;
    phone?: string;
    mobileMoneyNumber?: string;
    mobileMoneyNetwork?: UpdateUserDto.mobileMoneyNetwork;
    occupation?: string;
    isStudent?: boolean;
    schoolName?: string;
    gender?: UpdateUserDto.gender;
    ageBracket?: UpdateUserDto.ageBracket;
};
export namespace UpdateUserDto {
    export enum mobileMoneyNetwork {
        MTN = 'MTN',
        VODAFONE = 'Vodafone',
        AIRTEL_TIGO = 'AirtelTigo',
    }
    export enum gender {
        MALE = 'Male',
        FEMALE = 'Female',
        OTHER = 'Other',
        PREFER_NOT_TO_SAY = 'PreferNotToSay',
    }
    export enum ageBracket {
        AGE_18_24 = 'age_18_24',
        AGE_25_34 = 'age_25_34',
        AGE_35_44 = 'age_35_44',
        AGE_45_54 = 'age_45_54',
        AGE_55_PLUS = 'age_55_plus',
    }
}

