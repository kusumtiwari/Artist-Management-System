import { api } from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type {
  Artist,
  ArtistsResponse,
  CreateArtistPayload,
  CreateUserPayload,
  UsersResponse,
} from '../types/resources'
import type { User } from '../types/auth'

export const resourcesService = {
  fetchUsers: async (page = 1, pageSize = 10, search=''): Promise<UsersResponse> => {
    const res = await api.get(ENDPOINTS.USERS.LIST, {
      params: { page, pageSize, search },
    })
    return res.data
  },

  fetchArtists: async (page = 1, pageSize = 10, search = ''): Promise<ArtistsResponse> => {
    const res = await api.get(ENDPOINTS.ARTISTS.LIST, {
      params: { page, pageSize, search },
    })
    return res.data
  },

  fetchArtist: async (id: number): Promise<Artist> => {
    const res = await api.get(`${ENDPOINTS.ARTISTS.LIST}/${id}`)
    return res.data.artist
  },

  createUser: async (data: CreateUserPayload): Promise<UsersResponse> => {
    const res = await api.post(ENDPOINTS.USERS.CREATE, data)
    return res.data
  },

  updateUser: async (userId: number, data: Partial<CreateUserPayload>): Promise<{ success: boolean; user: User }> => {
    const res = await api.patch(`${ENDPOINTS.USERS.LIST}/${userId}`, data)
    return res.data
  },

  deleteUser: async (userId: number): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`${ENDPOINTS.USERS.LIST}/${userId}`)
    return res.data
  },

  createArtist: async (data: CreateArtistPayload): Promise<Artist> => {
    const res = await api.post(ENDPOINTS.ARTISTS.CREATE, data)
    return res.data
  },

  updateArtist: async (artistId: number, data: Partial<CreateArtistPayload>): Promise<{ success: boolean; artist: Artist }> => {
    const res = await api.patch(`${ENDPOINTS.ARTISTS.LIST}/${artistId}`, data)
    return res.data
  },

  deleteArtist: async (artistId: number): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`${ENDPOINTS.ARTISTS.LIST}/${artistId}`)
    return res.data
  },

  exportArtistCSV: async (): Promise<Blob> => {
    const res = await api.get(ENDPOINTS.ARTISTS.EXPORT_CSV, {
      responseType: 'blob',
    })
    return res.data
  },

  importArtistCSV: async (file: File): Promise<{ success: boolean; imported: number; errors: string[]; message: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post(ENDPOINTS.ARTISTS.IMPORT_CSV, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
