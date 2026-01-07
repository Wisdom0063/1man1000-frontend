/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSubmissionDto } from '../models/CreateSubmissionDto';
import type { ReviewSubmissionDto } from '../models/ReviewSubmissionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubmissionsService {
    /**
     * Create a new submission
     * @param requestBody
     * @returns any Submission created
     * @throws ApiError
     */
    public static submissionsControllerCreate(
        requestBody: CreateSubmissionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all submissions
     * @param campaignId
     * @param influencerId
     * @param approvalStatus
     * @returns any List of submissions
     * @throws ApiError
     */
    public static submissionsControllerFindAll(
        campaignId?: string,
        influencerId?: string,
        approvalStatus?: 'pending' | 'approved' | 'rejected',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submissions',
            query: {
                'campaignId': campaignId,
                'influencerId': influencerId,
                'approvalStatus': approvalStatus,
            },
        });
    }
    /**
     * Get current influencer submissions
     * @returns any List of influencer submissions
     * @throws ApiError
     */
    public static submissionsControllerGetInfluencerSubmissions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submissions/my-submissions',
        });
    }
    /**
     * Get submissions for a campaign
     * @param campaignId
     * @returns any List of campaign submissions
     * @throws ApiError
     */
    public static submissionsControllerGetCampaignSubmissions(
        campaignId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submissions/campaign/{campaignId}',
            path: {
                'campaignId': campaignId,
            },
        });
    }
    /**
     * Get submission by ID
     * @param id
     * @returns any Submission details
     * @throws ApiError
     */
    public static submissionsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submissions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Submission not found`,
            },
        });
    }
    /**
     * Delete submission
     * @param id
     * @returns any Submission deleted
     * @throws ApiError
     */
    public static submissionsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/submissions/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden`,
                404: `Submission not found`,
            },
        });
    }
    /**
     * Review submission (Admin only)
     * @param id
     * @param requestBody
     * @returns any Submission reviewed
     * @throws ApiError
     */
    public static submissionsControllerReview(
        id: string,
        requestBody: ReviewSubmissionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/submissions/{id}/review',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Submission not found`,
            },
        });
    }
}
