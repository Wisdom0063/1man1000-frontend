/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateQuestionDto = {
    questionText: string;
    questionType: CreateQuestionDto.questionType;
    questionOrder: number;
    isRequired?: boolean;
    options?: Array<string>;
    imageUrls?: Array<string>;
    ratingScaleType?: CreateQuestionDto.ratingScaleType;
};
export namespace CreateQuestionDto {
    export enum questionType {
        MULTIPLE_CHOICE_SINGLE = 'multiple_choice_single',
        MULTIPLE_CHOICE_MULTIPLE = 'multiple_choice_multiple',
        YES_NO = 'yes_no',
        RATING_STARS = 'rating_stars',
        RATING_SCALE = 'rating_scale',
        LIKERT = 'likert',
        SHORT_TEXT = 'short_text',
        LONG_TEXT = 'long_text',
        IMAGE_SELECTION = 'image_selection',
    }
    export enum ratingScaleType {
        STARS_1_5 = 'stars_1_5',
        SCALE_1_10 = 'scale_1_10',
        LIKERT = 'likert',
    }
}

