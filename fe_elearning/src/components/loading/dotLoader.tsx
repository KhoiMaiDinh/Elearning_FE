const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`circle relative flex items-center justify-center w-5 h-5 border-2 border-white/30 rounded-full bg-transparent animate-circle`}
          style={{ animationDelay: `${i * 0.3}s` }}
        >
          <div
            className="dot absolute w-4 h-4 rounded-full bg-white/30 animate-dot"
            style={{ animationDelay: `${i * 0.3}s` }}
          ></div>
          <div
            className="outline absolute w-5 h-5 rounded-full animate-outline"
            style={{ animationDelay: `${(i + 3) * 0.3}s` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
