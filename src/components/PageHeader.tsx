import { ChevronRight, Home } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs: {
    label: string
    href?: string
  }[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <nav className="flex items-center text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </a>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.label} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2" />
            {crumb.href ? (
              <a 
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tighter">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
} 