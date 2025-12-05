import { Link } from "react-router-dom";
import ThemeSetting from "./themeSetting";

export default function Sidebar() {
  return (
    <aside className="bg-sidebar md:fixed  w-full h-16 md:w-24 md:h-dvh md:rounded-tr-2xl md:rounded-br-2xl flex flex-row md:flex-col justify-between gap-5">
      <Link
        to="/"
        className="bg-accent rounded-br-2xl h-full w-20 md:w-full md:h-20 grid place-items-center"
      >
        <img
          src="/logo-img.png"
          alt="App logo"
          className="rounded-full h-12 w-12"
        />
      </Link>

      <div className="flex justify-center md:justify-between md:flex-col items-center mr-5 md:mr-0 gap-8 md:mb-5">
        <ThemeSetting />

        <div className="border-r h-full md:h-0 md:border-t border-accent-foreground/60 md:w-full"></div>

        <Link to="/profile">
          <img
            src="/profile-img.png"
            alt="User profile image"
            className="rounded-full hover:border hover:border-accent hover:scale-110 cursor-pointer"
          />
        </Link>
      </div>
    </aside>
  );
}
