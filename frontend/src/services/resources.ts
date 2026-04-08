import { api } from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type {
  Artist,
  ArtistsResponse,
  CreateArtistPayload,
  CreateUserPayload,
  UsersResponse,
} from '../types/resources'

export const resourcesService = {
  fetchUsers: async (page = 1, pageSize = 10, search=''): Promise<UsersResponse> => {
    const res = await api.get(ENDPOINTS.USERS.LIST, {
      params: { page, pageSize, search },
    })
    return res.data
  },

  fetchArtists: async (page = 1, pageSize = 10): Promise<ArtistsResponse> => {
    const res = await api.get(ENDPOINTS.ARTISTS.LIST, {
      params: { page, pageSize },
    })
    return res.data
  },

  createUser: async (data: CreateUserPayload): Promise<UsersResponse> => {
    const res = await api.post(ENDPOINTS.USERS.CREATE, data)
    return res.data
  },

  createArtist: async (data: CreateArtistPayload): Promise<Artist> => {
    const res = await api.post(ENDPOINTS.ARTISTS.CREATE, data)
    return res.data
  },
}
