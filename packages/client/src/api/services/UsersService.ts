/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UpdateUserStatusDto } from '../models/UpdateUserStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get all users (Admin only)
     * @param role
     * @param status
     * @returns any List of users
     * @throws ApiError
     */
    public static usersControllerFindAll(
        role?: 'client' | 'influencer' | 'admin',
        status?: 'pending' | 'approved' | 'rejected',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'role': role,
                'status': status,
            },
        });
    }
    /**
     * Get all influencers (Admin only)
     * @param status
     * @returns any List of influencers
     * @throws ApiError
     */
    public static usersControllerGetInfluencers(
        status?: 'pending' | 'approved' | 'rejected',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/influencers',
            query: {
                'status': status,
            },
        });
    }
    /**
     * Get all clients (Admin only)
     * @returns any List of clients
     * @throws ApiError
     */
    public static usersControllerGetClients(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/clients',
        });
    }
    /**
     * Get user by ID
     * @param id
     * @returns any User details
     * @throws ApiError
     */
    public static usersControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update user profile
     * @param id
     * @param requestBody
     * @returns any User updated
     * @throws ApiError
     */
    public static usersControllerUpdate(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Delete user (Admin only)
     * @param id
     * @returns any User deleted
     * @throws ApiError
     */
    public static usersControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update user status (Admin only)
     * @param id
     * @param requestBody
     * @returns any User status updated
     * @throws ApiError
     */
    public static usersControllerUpdateStatus(
        id: string,
        requestBody: UpdateUserStatusDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `User not found`,
            },
        });
    }
}
