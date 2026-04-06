interface SpinnerLoadingProps {
  className?: string;
  spinnerClassName?: string;
}

export const SpinnerLoading: React.FC<SpinnerLoadingProps> = ({ className, spinnerClassName }) => {
  return (
    <span className={`animate-spin absolute ${className}`}>
      <svg
        aria-hidden
        focusable={false}
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
        className={spinnerClassName}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M8.698.96a1.25 1.25 0 01-.83 1.561 6.75 6.75 0 108.457 8.335 1.25 1.25 0 012.4.696 9.249 9.249 0 01-17.783-.056A9.25 9.25 0 017.137.13a1.25 1.25 0 011.561.83z"
          clipRule="evenodd"
        ></path>
      </svg>
    </span>
  );
};
