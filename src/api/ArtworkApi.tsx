import axios, { AxiosRequestConfig } from 'axios';


//other devices cannot access if use 'localhost'
// const API_BASE_URL = 'http://192.168.50.156:5001';
// const API_BASE_URL = '/api/v1'
// 
/**
 * use 'npm start' ,  NODE_ENV='development'.
 * use 'npm run build'  , NODE_ENV='production' , use Nginx Proxy
 */
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/v1' : '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export interface QueryParams {
  page?: number,
  pageSize?: number,
  hasImage: boolean; //default true
  genre?: string;
  period?: string;
  technique?: string;
  searchText?: string; //
  color?: string;

  // MUST! 
  // The 'query' object includes a special field 'queryString', which is a JSON stringification of the entire search criteria.
  // This 'queryString' (a primitive string) is used as the key dependency  for useInfiniteQuery's 'queryKey'. 
  // This prevents React Query from triggering unnecessary re-fetches caused by non-stable object references 
  // of the 'query' object across renders, ensuring the API is called only  when the search content truly changes.
  queryString?: string; //concat all parameters
}

async function get(url: string, config?: AxiosRequestConfig, context = 'data'): Promise<any> {
  try {
    const res = await apiClient.get(url, config);
    return res.data;
  } catch (error) {
    console.error(`[API Error] ${context}:`, error);
    throw new Error(`Error fetching ${context}`);

  }
}

export async function fetchArtworkById(artworkId: any) {
  try {
    const response = await axios.get(`${API_BASE_URL}/artworks/vincent/${artworkId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching artwork details');
  }
}


export async function fetchArtData(query: QueryParams) {
  try {

    const queryParams = {
      page: query.page,
      pageSize: query.pageSize,
      search: query.searchText,
      hasImage: query.hasImage,// defult is TRUE
      genres: query.genre ? [query.genre] : [],
      period: query.period,
      techniques: query.technique ? [query.technique] : [],
      colorField: query.color
    };

    // console.log(`Query Params:`, queryParams);
    if (process.env.NODE_ENV === 'development') {
      const delay = Math.random() * 1000 + 500;//Mock network delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const response = await axios.get(API_BASE_URL + '/artworks/vincent', { params: queryParams });

    return response.data;
  } catch (err) {
    console.error(`Error fetching art data: ${err}`)
    throw new Error('Error fetching art data');
  }
}

export async function fetchSurpriseArt() {
  try {
    const response = await apiClient.get(`/artworks/vincent/surprise`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching artwork details');
  }
}


//对数据表所有数据执行distinct操作，成本价高
//TODO 考虑单独维护一个配置表
interface ConfigData {
  genres: string[],
  periods: string[],
  techniques: string[],
}
export async function fetchConfigData(): Promise<ConfigData> {
  try {

    // console.log(`Query Params:`, queryParams);
    if (process.env.NODE_ENV === 'development') {
      const delay = Math.random() * 1000 + 500;//Mock network delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const [genreRes, periodRes, techniques] = await Promise.all([
      axios.get(API_BASE_URL + '/artworks/vincent/config?cond=genre'),
      axios.get(API_BASE_URL + '/artworks/vincent/config?cond=period'),
      axios.get(API_BASE_URL + '/artworks/vincent/config?cond=technique'),
    ]);
    return {
      genres: genreRes.data,
      periods: periodRes.data,
      techniques: techniques.data
    };
  } catch (error) {
    throw new Error('Error fetching config data');
  }
}

export async function getLettersByIds(ids: string | string[]) {
  return get(`${API_BASE_URL}/letters/vincent`, { params: { ids: ids } }, 'letters');
}