import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { songService } from '../services/song'
import type { CreateSongPayload } from '../types/resources'
import { useToast } from '../components/ui/toast'

export const useSongsByArtist = (artistId: number, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['songs', artistId, page, limit],
    queryFn: () => songService.getSongsByArtist(artistId, page, limit),
    enabled: !!artistId
  })
}

export const useSong = (id: number) => {
  return useQuery({
    queryKey: ['song', id],
    queryFn: () => songService.getSong(id),
    enabled: !!id
  })
}

export const useCreateSong = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: CreateSongPayload) => songService.createSong(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['songs', variables.artist_id]
      })
      showToast('Song created successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to create song', 'error')
    }
  })
}

export const useUpdateSong = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSongPayload> }) =>
      songService.updateSong(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['song', variables.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['songs']
      })
      showToast('Song updated successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to update song', 'error')
    }
  })
}

export const useDeleteSong = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (id: number) => songService.deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['songs']
      })
      showToast('Song deleted successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to delete song', 'error')
    }
  })
}
