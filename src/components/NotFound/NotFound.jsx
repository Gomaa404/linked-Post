import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-primary text-8xl font-black">404</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
