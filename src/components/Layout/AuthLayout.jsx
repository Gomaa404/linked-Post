import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex flex-col items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl text-xl font-black lowercase">
            n
          </span>
          <span className="text-lg font-bold lowercase tracking-tight">nouxer</span>
        </Link>
        <Outlet />
        <p className="text-muted-foreground mt-8 text-center text-xs">
          © nouxer
        </p>
      </div>
    </div>
  );
}
