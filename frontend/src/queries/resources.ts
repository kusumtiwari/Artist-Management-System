import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { resourcesService } from '../services/resources'
import { useToast } from '../components/ui/toast'
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
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: CreateUserPayload) => resourcesService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      showToast('User created successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Create user failed', 'error')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: Partial<CreateUserPayload> }) =>
      resourcesService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      showToast('User updated successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Update user failed', 'error')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (userId: number) => resourcesService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      showToast('User deleted successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Delete user failed', 'error')
    },
  })
}

export const useCreateArtist = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: CreateArtistPayload) => resourcesService.createArtist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] })
      showToast('Artist created successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Create artist failed', 'error')
    },
  })
}
