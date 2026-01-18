import { useMasjidContext } from "@/context/masjidContext";

// Default pattern settings
const DEFAULT_PATTERN = {
  url: '/pattern8.jpg',
  size: '400px',
  opacity: 0.9,
};

interface LayoutWithHeaderProps {
  children: React.ReactNode;
  headerTitle: string;
  showHeader?: boolean;
  dates?: {
    hijri: string;
    gregorian: string;
  };
  /** Pass `true` for default pattern, a URL string, or an object for custom settings */
  backgroundPattern?: boolean | string | {
    url: string;
    size?: string;
    opacity?: number;
  };
}

const Header = ({ title, dates }: { title: string; dates?: { hijri: string; gregorian: string } }) => {
  const masjid = useMasjidContext();

  return (
    <header className={`grid grid-cols-3 items-center gap-4 flex-shrink-0`}>
      {/* Dates section (conditionally rendered) */}
      <div className="flex flex-col justify-center pl-4 sm:pl-6 lg:pl-8">
        {dates ? (
          <div className="space-y-1">
            <div className="space-y-1">
              <div
                className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base"
              >
                {dates.hijri}
              </div>
              <div
                className="font-medium text-gray-600 text-xs sm:text-sm"
              >
                {dates.gregorian}
              </div>
            </div>
          </div>
        ) : null}
      </div>

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
  dates,
  backgroundPattern,
}: LayoutWithHeaderProps) => {
  // Normalize backgroundPattern to a consistent object or null
  const pattern = backgroundPattern
    ? backgroundPattern === true
      ? DEFAULT_PATTERN
      : typeof backgroundPattern === 'string'
        ? { ...DEFAULT_PATTERN, url: backgroundPattern }
        : { ...DEFAULT_PATTERN, ...backgroundPattern }
    : null;

  return (
    <div className="font-montserrat h-full overflow-hidden">
      <div className="w-full mx-auto h-full relative overflow-hidden">
        <div
          className="bg-white h-full flex flex-col overflow-hidden relative"
          style={pattern ? {
            backgroundImage: `url(${pattern.url})`,
            backgroundSize: pattern.size,
            backgroundRepeat: 'repeat',
          } : undefined}
        >
          {/* Subtle overlay when background pattern is used */}
          {pattern && (
            <div
              className="absolute inset-0 bg-white pointer-events-none"
              style={{ opacity: pattern.opacity }}
              aria-hidden="true"
            />
          )}

          <div className={`${showHeader ? "mb-6 sm:mb-8 flex-shrink-0" : "pt-8 flex-shrink-0"} relative z-10`}>
            {showHeader && <Header title={headerTitle} dates={dates} />}
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
