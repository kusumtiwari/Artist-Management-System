import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePaginationRow,
  TableRow,
  TableSkeleton,
} from "../ui/table";
import { useUsers } from "../../queries/resources";
import { AddUserDialog } from "./add-user-dialog";
import type { UsersResponse } from "../../types/resources";
import { Input } from "../ui/Input";
import { debounce } from "../../utils/debounce";
import { SearchIcon } from "../../assets";
import { Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const usersQuery = useUsers(page, PAGE_SIZE, search);
  const usersData = usersQuery.data as UsersResponse | undefined;
  const TOTAL_COLUMNS = 9;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1); // reset page on search
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
        <div>
          <p className="text-sm text-default-secondary">
            Manage your registered users and access details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            prefixIcon={SearchIcon}
            placeholder="Search users..."
            prefixIconClassname="text-default-tertiary"
            className="text-14 sm:w-[280px] h-9"
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
          {/* Loading */}
          {usersQuery.isLoading && (
            <TableSkeleton col={TOTAL_COLUMNS} row={5} />
          )}

          {/* Empty state */}
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

          {/* Data */}
          {!usersQuery.isLoading &&
            usersData?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="min-w-[180px]">
                  {user.first_name} {user.last_name}
                </TableCell>

                <TableCell className="min-w-[220px]">{user.email}</TableCell>

                <TableCell className="min-w-[160px]">
                  {user.phone ?? "—"}
                </TableCell>

                <TableCell className="min-w-[140px]">
                  {user.gender ?? "—"}
                </TableCell>

                <TableCell className="min-w-[160px]">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "—"}
                </TableCell>

                <TableCell className="min-w-[220px] truncate">
                  {user.address ?? "—"}
                </TableCell>

                <TableCell className="min-w-[180px]">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="min-w-[180px]">
                  {new Date(user.updated_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="min-w-[140px]">
                  {/* Replace with your actions */}
                  <button className="text-primary hover:underline">View</button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TablePaginationRow
          total={usersData?.total ?? 0}
          pageSize={PAGE_SIZE}
          page={page}
          isLoading={usersQuery.isLoading}
          totalColumns={4}
          onPageChange={setPage}
        />
      </Table>
    </div>
  );
}
