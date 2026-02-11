/**
 * PublicFooter component for public pages (landing, signin, signup)
 * Features: Copyright notice and attribution
 */

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ToDo App. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with love by{' '}
            <span className="font-semibold text-foreground">Abdul Rafay</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
