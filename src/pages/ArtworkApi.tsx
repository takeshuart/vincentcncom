import axios, { AxiosRequestConfig } from 'axios';


// const apiDomain = 'http://localhost:5001/artworks';
//other devices cannot access if use 'localhost'
const apiDomain = 'http://192.168.50.156:5001/artworks';

export async function fetchArtworkById(artworkId: any) {
  try {
    const response = await axios.get(`${apiDomain}/vincent/id/${artworkId}`);
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
  periodSelected: string,
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
      periods: periodSelected ? [periodSelected] : [],
      techniques: techniqueSelected ? [techniqueSelected] : [],
      hexColor: colorSelected || undefined
    };

    const response = await axios.get(apiDomain + '/vincent/bypage', { params: queryParams });

    console.log(`Query Params:`, queryParams);

    return response.data;
  } catch (error) {
    throw new Error('Error fetching art data');
  }
}

export async function fetchSurpriseArt() {
  try {
    const response = await axios.get(`${apiDomain}/vincent/supriseme`);
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
    const [genreRes, periodRes, techniques] = await Promise.all([
      axios.get(apiDomain + '/vincent/config?cond=genre'),
      axios.get(apiDomain + '/vincent/config?cond=period'),
      axios.get(apiDomain + '/vincent/config?cond=technique'),
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
