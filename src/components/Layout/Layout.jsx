import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import RightRail from "@/components/Layout/RightRail";

export default function Layout() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </aside>

          <div className="mx-auto w-full min-w-0 max-w-2xl flex-1">
            <Outlet />
          </div>

          <aside className="hidden w-72 shrink-0 xl:block">
            <div className="sticky top-20">
              <RightRail />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
