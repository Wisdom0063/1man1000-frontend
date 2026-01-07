/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TargetViewRangeDto } from './TargetViewRangeDto';
export type UpdateCampaignDto = {
    brandName?: string;
    title?: string;
    description?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    targetViewRange?: TargetViewRangeDto;
    targetAudience?: string;
    industry?: string;
    adCreatives?: Array<string>;
    status?: UpdateCampaignDto.status;
    ratePerView?: number;
    submissionDeadlineDays?: number;
    paymentType?: UpdateCampaignDto.paymentType;
    paymentViewsThreshold?: number;
};
export namespace UpdateCampaignDto {
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        ACTIVE = 'active',
        COMPLETED = 'completed',
        REJECTED = 'rejected',
    }
    export enum paymentType {
        PER_VIEW = 'per_view',
        PER_VIEWS = 'per_views',
    }
}

