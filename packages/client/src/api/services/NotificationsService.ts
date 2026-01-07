/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNotificationDto } from '../models/CreateNotificationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Create a notification (Admin only)
     * @param requestBody
     * @returns any Notification created
     * @throws ApiError
     */
    public static notificationsControllerCreate(
        requestBody: CreateNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get current user notifications
     * @returns any List of notifications
     * @throws ApiError
     */
    public static notificationsControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications',
        });
    }
    /**
     * Get unread notifications count
     * @returns any Unread count
     * @throws ApiError
     */
    public static notificationsControllerGetUnreadCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/unread-count',
        });
    }
    /**
     * Mark notification as read
     * @param id
     * @returns any Notification marked as read
     * @throws ApiError
     */
    public static notificationsControllerMarkAsRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/{id}/read',
            path: {
                'id': id,
            },
            errors: {
                404: `Notification not found`,
            },
        });
    }
    /**
     * Mark all notifications as read
     * @returns any All notifications marked as read
     * @throws ApiError
     */
    public static notificationsControllerMarkAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/read-all',
        });
    }
    /**
     * Delete notification
     * @param id
     * @returns any Notification deleted
     * @throws ApiError
     */
    public static notificationsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/notifications/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Notification not found`,
            },
        });
    }
}
