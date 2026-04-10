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

export const useArtists = (page: number, pageSize = 10, search: string = '') => {
  return useQuery<ArtistsResponse>({
    queryKey: ['artists', page, search],
    queryFn: () => resourcesService.fetchArtists(page, pageSize, search),
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

export const useUpdateArtist = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ artistId, data }: { artistId: number; data: Partial<CreateArtistPayload> }) =>
      resourcesService.updateArtist(artistId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] })
      showToast('Artist updated successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Update artist failed', 'error')
    },
  })
}

export const useDeleteArtist = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (artistId: number) => resourcesService.deleteArtist(artistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] })
      showToast('Artist deleted successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Delete artist failed', 'error')
    },
  })
}

export const useExportArtistCSV = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: () => resourcesService.exportArtistCSV(),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `artists-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      showToast('Artists exported successfully', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Export failed', 'error')
    },
  })
}

export const useImportArtistCSV = () => {
  return useMutation({
    mutationFn: (file: File) => resourcesService.importArtistCSV(file),
  })
}