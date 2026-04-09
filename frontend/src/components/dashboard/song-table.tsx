import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableSkeleton } from '../ui/table'
import { Button } from '../ui/button'
import { AddSongDialog } from './add-song-dialog'
import { useSongsByArtist, useDeleteSong } from '../../queries/song'
import type { Song, SongsResponse } from '../../types/resources'
import DeleteModal from '../ui/delete-modal'

interface SongTableProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artistId: number
  artistName: string
}

const PAGE_SIZE = 10

export function SongTable({ open, onOpenChange, artistId, artistName }: SongTableProps) {
  const [page, setPage] = useState(1)
  const [songToEdit, setSongToEdit] = useState<Song | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const songsQuery = useSongsByArtist(artistId, page, PAGE_SIZE)
  const deleteSong = useDeleteSong()
  const songsData = songsQuery.data as SongsResponse | undefined

  const openAddDialog = (song?: Song | null) => {
    setSongToEdit(song ?? null)
    setIsAddOpen(true)
  }

  const handleDelete = () => {
    if (!selectedSong) return

    deleteSong.mutate(selectedSong.id, {
      onSuccess: () => {
        setIsDeleteOpen(false)
        setSelectedSong(null)
        songsQuery.refetch()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-full md:w-225">
        <DialogHeader>
          <div>
            <DialogTitle>Music for {artistName}</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button intent="secondary" onClick={() => openAddDialog(null)}>
              Add Song
            </Button>
            <DialogClose asChild>
              <Button intent="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          {songsQuery.isLoading && <TableSkeleton col={6} row={5} />}

          {!songsQuery.isLoading && songsData?.songs.length === 0 && (
            <div className="text-sm text-default-secondary">No songs found for this artist.</div>
          )}

          {!songsQuery.isLoading && songsData?.songs.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songsData?.songs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell>{song.title}</TableCell>
                    <TableCell>{song.album_name ?? '—'}</TableCell>
                    <TableCell>{song.genre}</TableCell>
                    <TableCell>{new Date(song.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(song.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button intent="ghost" size={1} onClick={() => openAddDialog(song)}>
                          Edit
                        </Button>
                        <Button
                          intent="dangerOutline"
                          size={1}
                          onClick={() => {
                            setSelectedSong(song)
                            setIsDeleteOpen(true)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {songsData?.pagination && songsData.pagination.totalPages > 1 && (
            <div className="flex justify-end mt-4">
              {/* simple pagination controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  intent="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </Button>
                <span className="text-sm text-default-secondary">
                  Page {page} of {songsData.pagination.totalPages}
                </span>
                <Button
                  type="button"
                  intent="outline"
                  disabled={page >= songsData.pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, songsData.pagination.totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button intent="outline">Done</Button>
          </DialogClose>
        </DialogFooter>

        <AddSongDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          artistId={artistId}
          song={songToEdit}
        />

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="p-0 max-w-md">
            <DeleteModal
              title="Delete song"
              isDeleting={deleteSong.isPending}
              onDelete={handleDelete}
            >
              Are you sure you want to delete <strong>{selectedSong?.title}</strong>?
            </DeleteModal>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
