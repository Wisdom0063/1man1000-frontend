/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TargetViewRangeDto } from './TargetViewRangeDto';
export type CreateCampaignDto = {
    brandName: string;
    title?: string;
    description?: string;
    budget: number;
    startDate: string;
    endDate: string;
    targetViewRange: TargetViewRangeDto;
    targetAudience: string;
    industry: string;
    adCreatives?: Array<string>;
    ratePerView?: number;
    submissionDeadlineDays?: number;
    paymentType?: CreateCampaignDto.paymentType;
    paymentViewsThreshold?: number;
};
export namespace CreateCampaignDto {
    export enum paymentType {
        PER_VIEW = 'per_view',
        PER_VIEWS = 'per_views',
    }
}

