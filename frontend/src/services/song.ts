import { api } from '../api/axios'
import type { Song, CreateSongPayload, SongsResponse } from '../types/resources'

export const songService = {
  async getSongsByArtist(artistId: number, page: number = 1, limit: number = 10) {
    const response = await api.get<SongsResponse>(`/songs/artist/${artistId}`, {
      params: { page, limit },
    })
    return response.data
  },

  async getSong(id: number) {
    const response = await api.get<{ success: boolean; song: Song }>(`/songs/${id}`)
    return response.data
  },

  async createSong(data: CreateSongPayload) {
    const response = await api.post<{ success: boolean; song: Song }>(`/songs`, data)
    return response.data
  },

  async updateSong(id: number, data: Partial<CreateSongPayload>) {
    const response = await api.put<{ success: boolean; song: Song }>(`/songs/${id}`, data)
    return response.data
  },

  async deleteSong(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`/songs/${id}`)
    return response.data
  },
}
