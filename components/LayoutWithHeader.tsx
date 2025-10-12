import { useMasjidContext } from "@/context/masjidContext";

interface LayoutWithHeaderProps {
  children: React.ReactNode;
  headerTitle: string;
  showHeader?: boolean;
}

const Header = ({ title }: { title: string }) => {
  const masjid = useMasjidContext();

  return (
    <header className={`grid grid-cols-3 items-center gap-4 flex-shrink-0`}>
      {/* Empty space for balance */}
      <div></div>

      {/* Centered Title */}
      <div className="flex items-center justify-center">
        <div className="bg-theme-accent text-theme-gradient px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg whitespace-nowrap">
          <h1 className="text-sm sm:text-lg lg:text-2xl font-medium tracking-wider">
            {title}
          </h1>
        </div>
      </div>

      {/* Logo with Themed Container */}
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 flex items-center justify-center border-x-4 border-b-8 border-theme-gradient rounded-b-full shadow-lg">
          {/* Logo container */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 flex items-center justify-center relative z-10 p-2">
            <img
              src={masjid?.logo || "/logo.png"}
              alt="Masjid Logo"
              className="logo-image w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const LayoutWithHeader = ({
  children,
  headerTitle,
  showHeader = true,
}: LayoutWithHeaderProps) => {
  return (
    <div className="font-montserrat h-full overflow-hidden">
      <div className="w-full mx-auto h-full relative overflow-hidden">
        <div className="bg-white h-full flex flex-col overflow-hidden">
          <div className={showHeader ? "mb-6 sm:mb-8 flex-shrink-0" : "pt-8 flex-shrink-0"}>
            {showHeader && <Header title={headerTitle} />}
          </div>

          {/* Page content */}
          <div className="flex-1 min-h-0 relative z-10 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutWithHeader;
