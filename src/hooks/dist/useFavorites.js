"use strict";
exports.__esModule = true;
exports.useRemoveFavoriteMutation = exports.useAddFavoriteMutation = exports.useFavoritesQuery = void 0;
var favoriteApi_1 = require("@/api/favoriteApi");
var react_query_1 = require("@tanstack/react-query");
function useFavoritesQuery(userId) {
    return react_query_1.useQuery({
        queryKey: ['favorites', userId],
        queryFn: function () { return favoriteApi_1.getFavoritesApi(userId); },
        enabled: !!userId
    });
}
exports.useFavoritesQuery = useFavoritesQuery;
function useAddFavoriteMutation() {
    var queryClient = react_query_1.useQueryClient();
    return react_query_1.useMutation({
        mutationFn: function (_a) {
            var userId = _a.userId, artworkId = _a.artworkId;
            return favoriteApi_1.addFavoriteApi(userId, artworkId);
        },
        onSuccess: function (newFavorite, variables) {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
        }
    });
}
exports.useAddFavoriteMutation = useAddFavoriteMutation;
function useRemoveFavoriteMutation() {
    var queryClient = react_query_1.useQueryClient();
    return react_query_1.useMutation({
        mutationFn: function (_a) {
            var userId = _a.userId, artworkId = _a.artworkId;
            return favoriteApi_1.removeFavoriteApi(userId, artworkId);
        },
        onSuccess: function (data, variables) {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
        }
    });
}
exports.useRemoveFavoriteMutation = useRemoveFavoriteMutation;
