import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 详情页的上一个/下一个按钮功能
 */
const STORAGE_KEY = 'currentPageContext';

const useSearchContextNavigation = (currentId) => {
    const navigate = useNavigate();
    const [searchContext, setSearchContext] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [list, setList] = useState([]);

    useEffect(() => {
        const contextJson = sessionStorage.getItem(STORAGE_KEY);

        if (contextJson) {
            try {
                const context = JSON.parse(contextJson);
                const artworkList = context.idList || [];
                const idString = String(currentId);

                // 尝试找到当前 ID 在列表中的位置
                const index = artworkList.findIndex(id => String(id) === idString);

                if (index !== -1) {
                    setSearchContext(context);
                    setList(artworkList);
                    setCurrentIndex(index);
                    //update current index
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...context, currentIndex: index }));
                } else {
                    //if not exist id ,hide arrow (maybe from Surprise Page)
                    sessionStorage.removeItem(STORAGE_KEY);
                    setSearchContext(null);
                    setList([]);
                    setCurrentIndex(-1);
                }

            } catch (e) {
                console.error('Error parsing search context from sessionStorage:', e);
                sessionStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [currentId]); //update sessionStorage while detailPage changed

    const goToNext = useCallback(() => {
        if (currentIndex < list.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextId = list[nextIndex];
            navigate(`/vincent/id/${nextId}`);
        }
    }, [currentIndex, list, navigate]);

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevId = list[prevIndex];
            navigate(`/vincent/id/${prevId}`);
        }
    }, [currentIndex, list, navigate]);

    // 3. 计算是否可以导航
    const canGoNext = useMemo(() => currentIndex !== -1 && currentIndex < list.length - 1, [currentIndex, list]);
    const canGoPrev = useMemo(() => currentIndex > 0, [currentIndex]);

    return {
        searchContext,
        canGoNext,
        canGoPrev,
        goToNext,
        goToPrev,
    };
};

export default useSearchContextNavigation;