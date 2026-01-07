/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePaymentDto } from '../models/CreatePaymentDto';
import type { UpdatePaymentStatusDto } from '../models/UpdatePaymentStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Create a new payment (Admin only)
     * @param requestBody
     * @returns any Payment created
     * @throws ApiError
     */
    public static paymentsControllerCreate(
        requestBody: CreatePaymentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all payments (Admin only)
     * @param influencerId
     * @param campaignId
     * @param status
     * @returns any List of payments
     * @throws ApiError
     */
    public static paymentsControllerFindAll(
        influencerId?: string,
        campaignId?: string,
        status?: 'pending' | 'paid',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payments',
            query: {
                'influencerId': influencerId,
                'campaignId': campaignId,
                'status': status,
            },
        });
    }
    /**
     * Get current influencer payments
     * @returns any List of influencer payments
     * @throws ApiError
     */
    public static paymentsControllerGetInfluencerPayments(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payments/my-payments',
        });
    }
    /**
     * Get current influencer earnings summary
     * @returns any Earnings summary
     * @throws ApiError
     */
    public static paymentsControllerGetInfluencerEarnings(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payments/my-earnings',
        });
    }
    /**
     * Get payment by ID
     * @param id
     * @returns any Payment details
     * @throws ApiError
     */
    public static paymentsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payments/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Payment not found`,
            },
        });
    }
    /**
     * Update payment status (Admin only)
     * @param id
     * @param requestBody
     * @returns any Payment status updated
     * @throws ApiError
     */
    public static paymentsControllerUpdateStatus(
        id: string,
        requestBody: UpdatePaymentStatusDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/payments/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Payment not found`,
            },
        });
    }
}
