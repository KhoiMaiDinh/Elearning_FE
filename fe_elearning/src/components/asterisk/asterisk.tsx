const Asterisk = ({ className }: { className?: string }) => {
  return (
    <span className={`text-[#f43f5e] ${className} mr-1 select-none font-semibold animate-pulse`}>
      *
    </span>
  );
};

export default Asterisk;
