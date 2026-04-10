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
import { useUsers, useDeleteUser } from "../../queries/resources";
import { AddUserDialog } from "./add-user-dialog";
import type { UsersResponse } from "../../types/resources";
import { Input } from "../ui/Input";
import { debounce } from "../../utils/debounce";
import { SearchIcon, Edit03Icon, Trash01Icon } from "../../assets";
import { Dialog, DialogContent } from "../ui/dialog";
import DeleteModal from "../ui/delete-modal";
import Pagination from "../ui/pagination";

const PAGE_SIZE = 10;
const TOTAL_COLUMNS = 9;

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const usersQuery = useUsers(page, PAGE_SIZE, search);
  const deleteUser = useDeleteUser();
  const usersData = usersQuery.data as UsersResponse | undefined;

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <p className="text-sm text-text-default-secondary">
          Manage your registered users and access details.
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            prefixIcon={SearchIcon}
            placeholder="Search users..."
            prefixIconClassname="text-text-default-secondary"
            className="text-14 sm:w-70 h-9 text-text-default"
            onChange={handleSearchChange}
          />
          <AddUserDialog onUserCreated={() => usersQuery.refetch()} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersQuery.isLoading && (
            <TableSkeleton col={TOTAL_COLUMNS} row={5} />
          )}

          {!usersQuery.isLoading && usersData?.users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={TOTAL_COLUMNS}
                className="text-center py-8 text-default-secondary"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}

          {!usersQuery.isLoading &&
            usersData?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="min-w-45">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="min-w-55">{user.email}</TableCell>
                <TableCell className="min-w-40">
                  {user.phone ?? "—"}
                </TableCell>
                <TableCell className="min-w-35">
                  {user.gender ?? "—"}
                </TableCell>
                <TableCell className="min-w-40">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="min-w-55 truncate">
                  {user.address ?? "—"}
                </TableCell>
                <TableCell className="min-w-45">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="min-w-45">
                  {new Date(user.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="min-w-25">
                  {user.isAdmin ? (
                    <span className="text-default-tertiary">—</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <AddUserDialog
                        mode="edit"
                        initialValues={{
                          ...user,
                          dob: user.dob ? new Date(user.dob) : null,
                          id: user.id,
                        }}
                        onUserCreated={() => usersQuery.refetch()}
                        trigger={
                          <button className="text-black hover:text-primary transition-colors">
                            <Edit03Icon className="text-primary w-6 h-5 cursor-pointer" />
                          </button>
                        }
                      />
                      <button
                        className="text-icon hover:text-error transition-colors"
                        disabled={deleteUser.isPending}
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash01Icon className="text-fill-error w-6 h-5 cursor-pointer" />
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        
      </Table>
       {!usersQuery.isLoading && (usersData?.pagination?.total ?? 0) > PAGE_SIZE && (
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={page}
            pageCount={Math.ceil((usersData?.pagination?.total ?? 0) / PAGE_SIZE)}
            onPageChange={setPage}
          />
        </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="p-0!">
          <DeleteModal
            title="Delete user"
            isDeleting={deleteUser.isPending}
            onDelete={() => {
              if (!selectedUser) return;

              deleteUser.mutate(selectedUser.id, {
                onSuccess: () => {
                  setIsDeleteOpen(false);
                  setSelectedUser(null);
                  usersQuery.refetch();
                },
              });
            }}
          >
            Are you sure you want to delete{" "}
            <b>
              {selectedUser?.first_name} {selectedUser?.last_name}
            </b>
            ?
          </DeleteModal>
        </DialogContent>
      </Dialog>
    </div>
  );
}
