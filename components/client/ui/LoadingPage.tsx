const LoadingPage = () => {
  return (
    <div className="h-screen bg-white rounded-2xl">
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-theme border-t-transparent rounded-full animate-spin" />
          <div className="text-theme text-lg font-medium">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
