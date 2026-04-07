import ReactPaginate from 'react-paginate';
import { ChevronLeftIcon } from '../../assets';
import { Button } from './button';

interface PaginationProps {
  currentPage?: number;
  pageCount?: number;
  onPageChange?: (selectedPage: number) => void;
}

export default function Pagination({ currentPage = 1, pageCount = 6, onPageChange }: PaginationProps) {
  // State to track the current page
  // Function to handle page changes
  const handlePageClick = (data: { selected: number }) => {
    // since the pagination starts from 0 in react-paginate
    const selectedPage = data.selected + 1;
    if (onPageChange) {
      onPageChange(selectedPage);
    }
  };

  return (
    <ReactPaginate
      previousLabel={
        <Button  className="text-default-secondary">
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>
      }
      nextLabel={
        <Button className="text-default-secondary ">
          Next
          <ChevronLeftIcon className="size-4 rotate-180" />
        </Button>
      }
      renderOnZeroPageCount={null}
      pageClassName="md:block text-md"
      breakLinkClassName="md:block"
      pageLinkClassName="w-[35px] aspect-square rounded-4 mx-1 inline-flex items-center justify-center hover:bg-surface"
      activeLinkClassName="bg-background border-2 border-fill-primary text-14 hover:bg-surface-active"
      containerClassName="flex items-center text-default justify-center md:justify-normal gap-x-1"
      disabledClassName="[&>a>button]:text-default-tertiary"
      previousClassName="mr-4"
      nextClassName="ml-4"
      pageCount={pageCount}
      onPageChange={handlePageClick}
      forcePage={currentPage - 1}
    />
  );
}
