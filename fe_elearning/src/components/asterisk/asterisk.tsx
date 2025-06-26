const Asterisk = ({ className }: { className?: string }) => {
  return (
    <span
      className={`text-[#f43f5e] ${className} mr-1 select-none font-semibold animate-pulse text-base/3`}
    >
      *
    </span>
  );
};

export default Asterisk;
