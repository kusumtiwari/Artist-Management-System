import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { resourcesService } from '../services/resources'
import type {
  ArtistsResponse,
  CreateArtistPayload,
  CreateUserPayload,
  UsersResponse,
} from '../types/resources'

export const useUsers = (page: number, pageSize = 10, search: string) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', page, search],
    queryFn: () => resourcesService.fetchUsers(page, pageSize, search),
    placeholderData: (previousData) => previousData,
  })
}

export const useArtists = (page: number, pageSize = 10) => {
  return useQuery<ArtistsResponse>({
    queryKey: ['artists', page],
    queryFn: () => resourcesService.fetchArtists(page, pageSize),
    placeholderData: (previousData) => previousData,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserPayload) => resourcesService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: Partial<CreateUserPayload> }) =>
      resourcesService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => resourcesService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useCreateArtist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateArtistPayload) => resourcesService.createArtist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] })
    },
  })
}
