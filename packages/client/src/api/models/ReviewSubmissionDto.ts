/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewSubmissionDto = {
    approvalStatus: ReviewSubmissionDto.approvalStatus;
    reviewNotes?: string;
};
export namespace ReviewSubmissionDto {
    export enum approvalStatus {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

