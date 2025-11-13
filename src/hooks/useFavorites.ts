import { addFavoriteApi, Favorite, getFavoritesApi, removeFavoriteApi } from '@/api/favoriteApi'
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useFavoritesQuery(userId: string): UseQueryResult<Favorite[]> {
    return useQuery({
        queryKey: ['favorites', userId],
        queryFn: () => getFavoritesApi(userId),
        enabled: !!userId, //Execute fn when userID is not empty
    });
}

export function useAddFavoriteMutation(): UseMutationResult<Favorite, Error, { userId: string, artworkId: string }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, artworkId }) => addFavoriteApi(userId, artworkId),

        onSuccess: (newFavorite, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
        },
    });
}

export function useRemoveFavoriteMutation(): UseMutationResult<void, Error, { userId: string, artworkId: string }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, artworkId }) => removeFavoriteApi(userId, artworkId),

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
        },
    });
}