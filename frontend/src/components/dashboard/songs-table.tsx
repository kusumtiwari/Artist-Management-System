import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "../ui/table";
import { useSongsByArtist, useDeleteSong } from "../../queries/song";
import { AddSongDialog } from "./add-song-dialog";
import type { SongsResponse } from "../../types/resources";
import { Input } from "../ui/Input";
import { debounce } from "../../utils/debounce";
import {
  SearchIcon,
  Edit03Icon,
  Trash01Icon,
  NoTableDataIcon,
} from "../../assets";
import { Dialog, DialogContent } from "../ui/dialog";
import DeleteModal from "../ui/delete-modal";
import Pagination from "../ui/pagination";

const PAGE_SIZE = 10;
const TOTAL_COLUMNS = 6;

interface SongsTableProps {
  artistId: number;
  artistName: string;
}

export function SongsTable({ artistId, artistName }: SongsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const songsQuery = useSongsByArtist(artistId, page, PAGE_SIZE, search);
  const deleteSong = useDeleteSong();
  const songsData = songsQuery.data as SongsResponse | undefined;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setSearch(value);
      }, 400),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            prefixIcon={SearchIcon}
            placeholder="Search songs..."
            prefixIconClassname="text-text-default-secondary"
            className="text-14 sm:w-70 h-9"
            onChange={handleSearchChange}
          />
          <AddSongDialog artistId={artistId} />
        </div>
      </div>

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
          {songsQuery.isLoading && (
            <TableSkeleton col={TOTAL_COLUMNS} row={5} />
          )}

          {!songsQuery.isLoading && (songsData?.songs?.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={TOTAL_COLUMNS} className="text-center py-8">
                <NoTableDataIcon className="mx-auto  w-36 h-36" />
                <p className="text-text-default-secondary text-lg">
                  No songs found!
                </p>
              </TableCell>
            </TableRow>
          )}

          {!songsQuery.isLoading &&
            songsData?.songs.map((song) => (
              <TableRow key={song.id}>
                <TableCell className="min-w-45">{song.title}</TableCell>
                <TableCell className="min-w-40">
                  {song.album_name ?? "—"}
                </TableCell>
                <TableCell className="min-w-30">{song.genre}</TableCell>
                <TableCell className="min-w-45">
                  {new Date(song.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="min-w-45">
                  {new Date(song.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="min-w-25">
                  <div className="flex items-center gap-3">
                    <AddSongDialog
                      artistId={artistId}
                      song={song}
                      trigger={
                        <button className="text-black hover:text-primary transition-colors">
                          <Edit03Icon className="text-primary w-6 h-5 cursor-pointer" />
                        </button>
                      }
                    />
                    <button
                      className="text-icon hover:text-error transition-colors"
                      disabled={deleteSong.isPending}
                      onClick={() => {
                        setSelectedSong(song);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash01Icon className="text-fill-error w-6 h-5 cursor-pointer" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!songsQuery.isLoading &&
        (songsData?.pagination?.total ?? 0) > PAGE_SIZE && (
          <div className="flex justify-end mt-4">
            <Pagination
              currentPage={page}
              pageCount={Math.ceil(
                (songsData?.pagination?.total ?? 0) / PAGE_SIZE,
              )}
              onPageChange={setPage}
            />
          </div>
        )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="p-0!">
          <DeleteModal
            title="Delete song"
            isDeleting={deleteSong.isPending}
            onDelete={() => {
              if (!selectedSong) return;

              deleteSong.mutate(selectedSong.id, {
                onSuccess: () => {
                  setIsDeleteOpen(false);
                  setSelectedSong(null);
                  songsQuery.refetch();
                },
              });
            }}
          >
            Are you sure you want to delete <b>{selectedSong?.title}</b>?
          </DeleteModal>
        </DialogContent>
      </Dialog>
    </div>
  );
}
