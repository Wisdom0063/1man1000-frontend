/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateQuestionDto } from './CreateQuestionDto';
export type CreateSurveyDto = {
    title: string;
    description?: string;
    targetResponses: number;
    isAnonymous?: boolean;
    ageRange?: string;
    genderFilter?: string;
    locationFilter?: Array<string>;
    paymentPerResponse?: number;
    questions: Array<CreateQuestionDto>;
};

