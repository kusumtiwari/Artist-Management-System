import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '../ui/dialog'
import { FormContent, FormGroup } from '../ui/form'
import { Input } from '../ui/Input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useCreateSong, useUpdateSong } from '../../queries/song'
import type { Song, CreateSongPayload } from '../../types/resources'

const GENRES = ['rnb', 'country', 'classic', 'rock', 'jazz'] as const

type SongFormValues = {
  title: string
  album_name?: string
  genre: CreateSongPayload['genre']
}

interface AddSongDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  artistId: number
  song?: Song | null
  trigger?: React.ReactNode
}

export function AddSongDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  artistId,
  song,
  trigger,
}: AddSongDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const createSong = useCreateSong()
  const updateSong = useUpdateSong()
  const isLoading = createSong.isPending || updateSong.isPending

  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SongFormValues>({
    defaultValues: {
      title: song?.title || '',
      album_name: song?.album_name || '',
      genre: song?.genre || 'rnb',
    },
  })

  useEffect(() => {
    reset({
      title: song?.title || '',
      album_name: song?.album_name || '',
      genre: song?.genre || 'rnb',
    })
  }, [song, reset])

  const onSubmit: SubmitHandler<SongFormValues> = (data) => {
    const payload: CreateSongPayload = {
      title: data.title,
      artist_id: artistId,
      album_name: data.album_name,
      genre: data.genre,
    }

    if (song) {
      updateSong.mutate(
        { id: song.id, data: payload },
        {
          onSuccess: () => {
            setIsOpen(false)
          },
        }
      )
    } else {
      createSong.mutate(payload, {
        onSuccess: () => {
          setIsOpen(false)
        },
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button intent="secondary">
            {song ? 'Edit Song' : 'Add Song'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-xl md:w-130">
        <DialogHeader>
          <DialogTitle>{song ? 'Edit Song' : 'Add Song'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContent className="p-6">
            <FormGroup>
              <Label htmlFor="title" required>
                Title
              </Label>
              <Input
                id="title"
                placeholder="Song title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 2, message: 'Title must be at least 2 characters' },
                  maxLength: { value: 255, message: 'Title must not exceed 255 characters' },
                })}
                error={errors.title?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="album_name">Album Name</Label>
              <Input
                id="album_name"
                placeholder="Album name (optional)"
                {...register('album_name', {
                  maxLength: { value: 255, message: 'Album name must not exceed 255 characters' },
                })}
                error={errors.album_name?.message as string}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="genre" required>
                Genre
              </Label>
              <select
                id="genre"
                {...register('genre', { required: 'Genre is required' })}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-default focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  backgroundColor: 'var(--bg-background)',
                  color: 'var(--text-default)',
                }}
              >
                <option value="">Select a genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <span className="text-xs text-red-500">{errors.genre.message}</span>
              )}
            </FormGroup>

            <DialogFooter className="gap-2 mt-4">
              <DialogClose asChild>
                <Button intent="outline" type="button" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={isLoading}>
                {song ? 'Update Song' : 'Add Song'}
              </Button>
            </DialogFooter>
          </FormContent>
        </form>
      </DialogContent>
    </Dialog>
  )
}
