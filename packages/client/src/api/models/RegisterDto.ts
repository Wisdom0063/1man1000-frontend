/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDto = {
    email: string;
    password: string;
    role: RegisterDto.role;
    name: string;
    company?: string;
    phone: string;
};
export namespace RegisterDto {
    export enum role {
        CLIENT = 'client',
        INFLUENCER = 'influencer',
    }
}

