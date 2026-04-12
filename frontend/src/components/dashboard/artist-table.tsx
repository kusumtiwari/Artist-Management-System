import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "../ui/table";
import {
  useArtists,
  useDeleteArtist,
  useExportArtistCSV,
} from "../../queries/resources";
import { AddArtistDialog } from "./add-artist-dialog";
import { ImportArtistDialog } from "./import-artist-dialog";
import type { Artist, ArtistsResponse } from "../../types/resources";
import { Input } from "../ui/Input";
import { debounce } from "../../utils/debounce";
import {
  SearchIcon,
  Edit03Icon,
  Trash01Icon,
  NoTableDataIcon,
} from "../../assets";
import DeleteModal from "../ui/delete-modal";
import Pagination from "../ui/pagination";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { MusicNoteIcon } from "../../assets/icons";
import ErrorMsg from "../ui/error";

const PAGE_SIZE = 10;
const TOTAL_COLUMNS = 9;

function ExportButton() {
  const exportArtists = useExportArtistCSV();

  return (
    <Button
      intent="secondary"
      onClick={() => exportArtists.mutate()}
      isLoading={exportArtists.isPending}
    >
      Export CSV
    </Button>
  );
}

export function ArtistsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const artistsQuery = useArtists(page, PAGE_SIZE, search);
  const artistsData = artistsQuery.data as ArtistsResponse | undefined;
  const deleteArtist = useDeleteArtist();

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
  if (artistsQuery.isLoading) {
    return (
      <Table>
        <TableBody>
          <TableSkeleton col={TOTAL_COLUMNS} row={5} />
        </TableBody>
      </Table>
    );
  }
  if (artistsQuery.isError) {
    return (
      <ErrorMsg
        message="Failed to load artists."
      />
    );
  }

  if (!artistsData?.artists.length) {
    return (
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <p className="text-sm text-text-default-secondary">
            Manage registered artists and their profile information.
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              prefixIcon={SearchIcon}
              placeholder="Search artists..."
              prefixIconClassname="text-default-tertiary"
              className="text-14 sm:w-70 h-9 text-text-default-secondary"
              onChange={handleSearchChange}
            />
            <ImportArtistDialog />
            <ExportButton />
            <AddArtistDialog />
          </div>
        </div>

        <div className="text-center py-10">
          <NoTableDataIcon className="mx-auto mb-4 w-36 h-36" />
          <p className="text-lg">No artists found!</p>
        </div>
      </div>
    );
  }

  // 🔥 4. Success
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <p className="text-sm text-text-default-secondary">
          Manage registered artists and their profile information.
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            prefixIcon={SearchIcon}
            placeholder="Search artists..."
            prefixIconClassname="text-default-tertiary"
            className="text-14 sm:w-70 h-9 text-text-default-secondary"
            onChange={handleSearchChange}
          />
          <ImportArtistDialog />
          <ExportButton />
          <AddArtistDialog />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>First Release Year</TableHead>
            <TableHead>Albums Released</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {artistsData.artists.map((artist) => (
            <TableRow
              key={artist.id}
              clickable
              onClick={() => navigate(`/artist/${artist.id}/songs`)}
            >
              <TableCell className="min-w-45">{artist.name}</TableCell>
              <TableCell className="min-w-30">
                {artist.gender ?? "—"}
              </TableCell>
              <TableCell className="min-w-40">
                {artist.dob
                  ? new Date(artist.dob).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell className="min-w-55 truncate">
                {artist.address ?? "—"}
              </TableCell>
              <TableCell className="min-w-40">
                {artist.first_release_year ?? "—"}
              </TableCell>
              <TableCell className="min-w-35">
                {artist.no_of_albums_released ?? "0"}
              </TableCell>
              <TableCell className="min-w-45">
                {new Date(artist.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="min-w-45">
                {new Date(artist.updated_at).toLocaleDateString()}
              </TableCell>

              {/* Actions */}
              <TableCell className="min-w-25">
                <div className="flex items-center gap-3">
                  {/* Songs */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/artist/${artist.id}/songs`);
                    }}
                  >
                    <MusicNoteIcon className="w-6 h-5 text-primary" />
                  </button>

                  {/* Edit */}
                  <AddArtistDialog
                    mode="edit"
                    initialValues={{
                      ...artist,
                      dob: artist.dob ? new Date(artist.dob) : null,
                      address: artist.address || undefined,
                      first_release_year:
                        artist.first_release_year || undefined,
                      no_of_albums_released:
                        artist.no_of_albums_released || undefined,
                      id: artist.id,
                    }}
                    trigger={
                      <button
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit03Icon className="text-primary w-6 h-5 cursor-pointer" />
                      </button>
                    }
                  />

                  {/* Delete */}
                  <button
                    disabled={deleteArtist.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtist(artist);
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

      {/* Pagination */}
      {(artistsData.pagination?.total ?? 0) > PAGE_SIZE && (
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={page}
            pageCount={Math.ceil(
              (artistsData.pagination?.total ?? 0) / PAGE_SIZE,
            )}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="p-0!">
          <DeleteModal
            title="Delete artist"
            isDeleting={deleteArtist.isPending}
            onDelete={() => {
              if (!selectedArtist) return;

              deleteArtist.mutate(selectedArtist.id, {
                onSuccess: () => {
                  setIsDeleteOpen(false);
                  setSelectedArtist(null);
                },
              });
            }}
          >
            Are you sure you want to delete{" "}
            <b>{selectedArtist?.name}</b>?
          </DeleteModal>
        </DialogContent>
      </Dialog>
    </div>
  );
}