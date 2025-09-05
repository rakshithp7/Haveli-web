export function Footer() {
  return (
    <footer className="mt-10 border-t border-black/10">
      <div className="container-responsive py-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} Haveli. All rights reserved.</p>
          <p className="text-muted">123 Spice Rd, Your City • (555) 123-4567</p>
        </div>
      </div>
    </footer>
  );
}

