import { getServerTheme } from "@/lib/server/services/theme";
import ThemeScript from "@/components/ThemeScript";

interface ThemeWrapperProps {
  id: string;
  children: React.ReactNode;
}

export default async function ThemeWrapper({ id, children }: ThemeWrapperProps) {
  const { themeStyles } = await getServerTheme(id);
  
  return (
    <>
      <ThemeScript 
        baseColor={themeStyles.baseColor}
        accentColor={themeStyles.accentColor}
        gradientColor={themeStyles.gradientColor}
      />
      {children}
    </>
  );
}
