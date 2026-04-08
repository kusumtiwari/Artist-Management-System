import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Form, FormContent, FormGroup } from '../ui/form'
import { Input } from '../ui/Input'
import { Label } from '../ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePaginationRow,
  TableRow,
  TableSkeleton,
} from '../ui/table'
import { useArtists, useCreateArtist } from '../../queries/resources'
import type { ArtistsResponse } from '../../types/resources'

const PAGE_SIZE = 10

export function ArtistsTable() {
  const [page, setPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const artistsQuery = useArtists(page, PAGE_SIZE)
  const artistsData = artistsQuery.data as ArtistsResponse | undefined
  const createArtist = useCreateArtist()

  const handleCreateArtist = (values: {
    name: string
    genre: string
    email?: string
    status?: 'active' | 'inactive'
  }) => {
    createArtist.mutate(values, {
      onSuccess: () => {
        setIsDialogOpen(false)
      },
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-sm text-default-secondary">Browse artists and manage their basic profile information.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size={2} intent="secondary">
              Add artist
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xl">
            <DialogHeader className="mb-4">
              <DialogTitle>Add new artist</DialogTitle>
              <DialogDescription>Enter artist details to add them to the roster.</DialogDescription>
            </DialogHeader>
            <Form onSubmit={handleCreateArtist} defaultValues={{ name: '', genre: '', email: '', status: 'active' }}>
              {({ register }) => (
                <FormContent>
                  <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} placeholder="Artist name" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" {...register('genre')} placeholder="Genre" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} placeholder="Email address" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" {...register('status')} placeholder="Active / inactive" />
                  </FormGroup>
                  <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-4">
                    <DialogClose asChild>
                      <Button intent="outline" size={2} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" size={2} isLoading={createArtist.isPending} className="w-full sm:w-auto">
                      Save artist
                    </Button>
                  </DialogFooter>
                </FormContent>
              )}
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artistsQuery.isLoading && <TableSkeleton col={4} row={5} />}
          {!artistsQuery.isLoading && artistsData?.artists.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-default-secondary">
                No artists found.
              </TableCell>
            </TableRow>
          )}
          {!artistsQuery.isLoading && artistsData?.artists.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell>{artist.name}</TableCell>
              <TableCell>{artist.genre}</TableCell>
              <TableCell>{artist.email ?? '—'}</TableCell>
              <TableCell>{artist.status ?? 'active'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePaginationRow
          total={artistsData?.total ?? 0}
          pageSize={PAGE_SIZE}
          page={page}
          isLoading={artistsQuery.isLoading}
          totalColumns={4}
          onPageChange={setPage}
        />
      </Table>
    </div>
  )
}
