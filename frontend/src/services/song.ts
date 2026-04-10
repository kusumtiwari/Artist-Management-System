import { api } from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { Song, CreateSongPayload, SongsResponse } from '../types/resources'

export const songService = {
  async getSongsByArtist(artistId: number, page = 1, limit = 10, search = '') {
    const response = await api.get<SongsResponse>(`${ENDPOINTS.SONGS.BY_ARTIST}/${artistId}`, {
      params: { page, limit, search },
    })
    return response.data
  },

  async getSong(id: number) {
    const response = await api.get<{ success: boolean; song: Song }>(`${ENDPOINTS.SONGS.DETAIL}/${id}`)
    return response.data
  },

  async createSong(data: CreateSongPayload) {
    const response = await api.post<{ success: boolean; song: Song }>(ENDPOINTS.SONGS.CREATE, data)
    return response.data
  },

  async updateSong(id: number, data: Partial<CreateSongPayload>) {
    const response = await api.patch<{ success: boolean; song: Song }>(`${ENDPOINTS.SONGS.UPDATE}/${id}`, data)
    return response.data
  },

  async deleteSong(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`${ENDPOINTS.SONGS.DELETE}/${id}`)
    return response.data
  },
}
