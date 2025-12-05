import { MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSetting() {
  // Check if user has a saved theme preference, if not, set light mode as default. // true - light, false - dark
  const [isLightMode, setIsLightMode] = useState(() => {
    if (localStorage.getItem("userThemeChoice") === null) {
      localStorage.setItem("userThemeChoice", "true");
      return true;
    } else {
      return localStorage.getItem("userThemeChoice") === "true" ? true : false;
    }
  });

  // On page load, set site theme based on user's currently saved theme.
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    // Save user's theme preference to local storage
    localStorage.setItem("userThemeChoice", String(isLightMode));
  }, [isLightMode]);

  // Handle theme switch
  const toggleTheme = () => {
    document.documentElement.classList.toggle("darkMode");
    setIsLightMode((preVal) => !preVal);
  };

  return (
    <div className="cursor-pointer hover:scale-125" onClick={toggleTheme}>
      {isLightMode ? (
        <MoonStar size={22} className="text-muted-foreground" />
      ) : (
        <Sun size={22} className="text-muted-foreground" />
      )}
    </div>
  );
}
