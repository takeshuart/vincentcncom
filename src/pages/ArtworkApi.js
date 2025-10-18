import axios from 'axios';

const apiDomain = 'http://localhost:5001/artworks';

export async function fetchArtworkById(artworkId) {
  try {
    const response = await axios.get(`${apiDomain}/vincent/id/${artworkId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching artwork details');
  }
}

export async function fetchArtData(page, pageSize, searchKeyword, hasImage, genreSelected, periodSelected, techniqueSelected) {
  try {
    const response = await axios.get(apiDomain + '/vincent/bypage', {
      params: {
        page: page,
        pageSize: pageSize,
        search: searchKeyword,
        hasImage: hasImage,
        genres: genreSelected ? [genreSelected] : [],
        periods: periodSelected ? [periodSelected] : [],
        techniques: techniqueSelected ? [techniqueSelected] : []
      }
    });
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
  export async function fetchConfigData() {
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
