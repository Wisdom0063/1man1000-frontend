/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSurveyDto } from '../models/CreateSurveyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SurveysService {
    /**
     * Create a new survey
     * @param requestBody
     * @returns any Survey created
     * @throws ApiError
     */
    public static surveysControllerCreate(
        requestBody: CreateSurveyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/surveys',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all surveys
     * @param status
     * @param clientId
     * @returns any List of surveys
     * @throws ApiError
     */
    public static surveysControllerFindAll(
        status?: string,
        clientId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys',
            query: {
                'status': status,
                'clientId': clientId,
            },
        });
    }
    /**
     * Get current client surveys
     * @returns any List of client surveys
     * @throws ApiError
     */
    public static surveysControllerGetClientSurveys(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/my-surveys',
        });
    }
    /**
     * Get surveys assigned to influencer
     * @returns any List of assigned surveys
     * @throws ApiError
     */
    public static surveysControllerGetInfluencerSurveys(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/assigned',
        });
    }
    /**
     * Get survey by ID
     * @param id
     * @returns any Survey details
     * @throws ApiError
     */
    public static surveysControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Survey not found`,
            },
        });
    }
    /**
     * Delete survey
     * @param id
     * @returns any Survey deleted
     * @throws ApiError
     */
    public static surveysControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/surveys/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get survey responses
     * @param id
     * @returns any List of responses
     * @throws ApiError
     */
    public static surveysControllerGetSurveyResponses(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/{id}/responses',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update survey status (Admin only)
     * @param id
     * @returns any Status updated
     * @throws ApiError
     */
    public static surveysControllerUpdateStatus(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/surveys/{id}/status',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Assign influencer to survey (Admin only)
     * @param id
     * @param influencerId
     * @returns any Influencer assigned
     * @throws ApiError
     */
    public static surveysControllerAssignInfluencer(
        id: string,
        influencerId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/surveys/{id}/assign/{influencerId}',
            path: {
                'id': id,
                'influencerId': influencerId,
            },
        });
    }
    /**
     * Submit survey response
     * @param id
     * @returns any Response submitted
     * @throws ApiError
     */
    public static surveysControllerSubmitResponse(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/surveys/{id}/respond',
            path: {
                'id': id,
            },
        });
    }
}
