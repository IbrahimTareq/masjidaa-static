import { Database } from "@/database.types";
import { getMasjidById } from "../../services/masjid";
import { getMasjidThemeById } from "../../services/masjidTheme";

type Theme = Database["public"]["Tables"]["themes"]["Row"];

/**
 * Server-side function to fetch theme data for a masjid
 */
export async function getServerTheme(masjidId: string): Promise<{
  theme: Theme | null;
  themeStyles: {
    baseColor: string;
    accentColor: string;
    gradientColor: string;
  };
}> {
  // Default theme colors
  const defaultTheme = {
    baseColor: "#0C8C4D",
    accentColor: "#0C8C4D",
    gradientColor: "#0d7d45"
  };
  
  try {
    // First, get the masjid to find the theme_color_id
    const masjid = await getMasjidById(masjidId);

    if (!masjid?.theme_color_id) {
      return { 
        theme: null,
        themeStyles: defaultTheme
      };
    }

    // Then fetch the theme using the theme_color_id
    const theme = await getMasjidThemeById(masjid.theme_color_id);

    if (!theme) {
      return { 
        theme: null,
        themeStyles: defaultTheme
      };
    }

    return {
      theme,
      themeStyles: {
        baseColor: theme.base_color || defaultTheme.baseColor,
        accentColor: theme.accent_color || defaultTheme.accentColor,
        gradientColor: theme.gradient_color || defaultTheme.gradientColor
      }
    };
  } catch (error) {
    console.error("Error fetching theme:", error);
    return {
      theme: null,
      themeStyles: defaultTheme
    };
  }
}
