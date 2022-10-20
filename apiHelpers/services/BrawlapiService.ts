import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BRAWLAPI_API_BASE_URL } from '../settings'

class BrawlapiService {
  private getAxiosInstance(): AxiosInstance {
    const axiosInstance = axios.create({
      baseURL: BRAWLAPI_API_BASE_URL
    });

    return axiosInstance;
  }

  private async requestBrawlapi(requestConfig: AxiosRequestConfig): Promise<AxiosResponse> {
    const axiosInstance = this.getAxiosInstance();

    const response: AxiosResponse = await axiosInstance.request(requestConfig);

    return response;
  }

  async getClubIconUrl(iconId: number): Promise<string | undefined> {
    const response = await this.requestBrawlapi({
      method: 'GET',
      url: '/icons'
    });

    return response.data.club[iconId].imageUrl;
  }

  async getPlayerIconList() {
    const response = await this.requestBrawlapi({
      method: 'GET',
      url: '/icons'
    });

    return response.data.player;
  }
}
export default new BrawlapiService();