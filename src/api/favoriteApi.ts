import { SuccessResponse, ErrorResponse } from '../types/api';
import { HttpStatusCode } from "axios";
import apiV1 from './requests';

export interface Favorite {
    id: number;
    userId: number;
    artworkId: number;
    createdAt: string;
}

const API_PREFIX = '/users';


export async function addFavoriteApi(userId: string, artworkId: string): Promise<Favorite> {
    const url = `${API_PREFIX}/${userId}/favorites`;
    const res = await apiV1.post<SuccessResponse<Favorite>>(url, { artworkId });

    return res.data.data;
}

export async function removeFavoriteApi(userId: string, artworkId: string): Promise<void> {
    const url = `${API_PREFIX}/${userId}/favorites/${artworkId}`;
    await apiV1.delete<SuccessResponse<any>>(url);
}

export async function getFavoritesApi(userId: string): Promise<Favorite[]> {
    const url = `${API_PREFIX}/${userId}/favorites`;
    const res = await apiV1.get<SuccessResponse<Favorite[]>>(url);

    return res.data.data;
}
