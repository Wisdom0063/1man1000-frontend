/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCampaignDto } from '../models/CreateCampaignDto';
import type { UpdateCampaignDto } from '../models/UpdateCampaignDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CampaignsService {
    /**
     * Create a new campaign
     * @param requestBody
     * @returns any Campaign created
     * @throws ApiError
     */
    public static campaignsControllerCreate(
        requestBody: CreateCampaignDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/campaigns',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all campaigns
     * @param status
     * @param clientId
     * @returns any List of campaigns
     * @throws ApiError
     */
    public static campaignsControllerFindAll(
        status?: 'pending' | 'approved' | 'active' | 'completed' | 'rejected',
        clientId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/campaigns',
            query: {
                'status': status,
                'clientId': clientId,
            },
        });
    }
    /**
     * Get current client campaigns
     * @returns any List of client campaigns
     * @throws ApiError
     */
    public static campaignsControllerGetClientCampaigns(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/campaigns/my-campaigns',
        });
    }
    /**
     * Get campaigns assigned to influencer
     * @returns any List of assigned campaigns
     * @throws ApiError
     */
    public static campaignsControllerGetInfluencerCampaigns(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/campaigns/assigned',
        });
    }
    /**
     * Get campaign by ID
     * @param id
     * @returns any Campaign details
     * @throws ApiError
     */
    public static campaignsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/campaigns/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Update campaign
     * @param id
     * @param requestBody
     * @returns any Campaign updated
     * @throws ApiError
     */
    public static campaignsControllerUpdate(
        id: string,
        requestBody: UpdateCampaignDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/campaigns/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Delete campaign
     * @param id
     * @returns any Campaign deleted
     * @throws ApiError
     */
    public static campaignsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/campaigns/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden`,
                404: `Campaign not found`,
            },
        });
    }
    /**
     * Update campaign status (Admin only)
     * @param id
     * @returns any Status updated
     * @throws ApiError
     */
    public static campaignsControllerUpdateStatus(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/campaigns/{id}/status',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Assign influencer to campaign (Admin only)
     * @param id
     * @param influencerId
     * @returns any Influencer assigned
     * @throws ApiError
     */
    public static campaignsControllerAssignInfluencer(
        id: string,
        influencerId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/campaigns/{id}/assign/{influencerId}',
            path: {
                'id': id,
                'influencerId': influencerId,
            },
            errors: {
                400: `Bad request`,
            },
        });
    }
    /**
     * Remove influencer from campaign (Admin only)
     * @param id
     * @param influencerId
     * @returns any Influencer removed
     * @throws ApiError
     */
    public static campaignsControllerRemoveInfluencer(
        id: string,
        influencerId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/campaigns/{id}/assign/{influencerId}',
            path: {
                'id': id,
                'influencerId': influencerId,
            },
            errors: {
                404: `Assignment not found`,
            },
        });
    }
}
