import axios, { AxiosRequestConfig } from 'axios';


//other devices cannot access if use 'localhost'
// const API_BASE_URL = 'http://192.168.50.156:5001';
const API_BASE_URL = 'http://localhost:5001';
// const API_BASE_URL = 'http://49.235.40.16:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

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
    const response = await axios.get(`${API_BASE_URL}/artworks/vincent/id/${artworkId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching artwork details');
  }
}

export async function fetchArtData(
  page: number,
  pageSize: number,
  searchKeyword: string,
  hasImage: boolean,
  genreSelected: string,
  selectedPeriod: string,
  techniqueSelected: string,
  colorSelected: string | undefined
) {
  try {
    // 1. 定义 URL 查询参数对象
    const queryParams = {
      page: page,
      pageSize: pageSize,
      search: searchKeyword,
      hasImage: hasImage,
      genres: genreSelected ? [genreSelected] : [],
      period: selectedPeriod,
      techniques: techniqueSelected ? [techniqueSelected] : [],
      colorField: colorSelected || undefined
    };

    console.log(`Query Params:`, queryParams);

    //模拟网络延迟，0.5~1.5秒随机延迟
    const delay = Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const response = await axios.get(API_BASE_URL + '/artworks/vincent/bypage', { params: queryParams });

    return response.data;
  } catch (err) {
    console.error(`Error fetching art data: ${err}`)
    throw new Error('Error fetching art data');
  }
}

export async function fetchSurpriseArt() {
  try {
    const response = await axios.get(`${API_BASE_URL}/artworks/vincent/supriseme`);
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

   const delay = Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));

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
  return get(`${API_BASE_URL}/vincent/letter/byletids`, { params: { ids: ids } }, 'letters');
}