import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-5">
      <Sidebar />

      <main className="w-full md:w-[85%] lg:w-[70%] px-4 md:pl-16 mx-auto my-5 md:my-10 relative">
        <Outlet />
      </main>
    </div>
  );
}
