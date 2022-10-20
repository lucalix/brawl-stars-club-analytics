import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IClubFromSupercellApi } from '../dtos'
import { SUPERCELL_API_BASE_URL, SUPERCELL_API_TOKEN } from '../settings'

class SupercellService {
  private getAxiosInstance(): AxiosInstance {
    const axiosInstance = axios.create({
      baseURL: SUPERCELL_API_BASE_URL,
      headers: { 'Authorization': SUPERCELL_API_TOKEN }
    });

    return axiosInstance;
  }

  private async requestSupercellApi(requestConfig: AxiosRequestConfig): Promise<AxiosResponse> {
    const axiosInstance = this.getAxiosInstance();

    const response: AxiosResponse = await axiosInstance.request(requestConfig);

    return response;
  }

  async getClub(clubTag: string): Promise<IClubFromSupercellApi | undefined> {
    const encodedClubTag = encodeURIComponent(clubTag);

    const response = await this.requestSupercellApi({
      method: 'GET',
      url: `/clubs/${encodedClubTag}`
    });

    const club: IClubFromSupercellApi = response.data;

    return club;
  }
}
export default new SupercellService();