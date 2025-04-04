import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Github, Twitter } from "lucide-react";

const apps = [
  {
    title: "Sound Tracker",
    description: "Track TikTok sound metrics and growth",
    href: "https://sound-tracker.vercel.app",
    image: "/sound-tracker-preview.png"
  },
  {
    title: "Indiestack",
    description: "A&R dashboard for indie labels",
    href: "https://indiestack.vercel.app",
    image: "/indiestack-preview.png"
  }
];

const footerLinks = [
  {
    title: "Support",
    links: [
      { label: "Contact", href: "mailto:support@jaketrefethen.com" },
      { label: "Documentation", href: "https://docs.jaketrefethen.com" },
      { label: "Status", href: "https://status.jaketrefethen.com" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" }
    ]
  }
];

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="flex flex-col items-center text-center mb-16">
          <Avatar className="w-24 h-24 mb-6">
            <AvatarImage src="/avatar.jpg" alt="Jake Trefethen" />
            <AvatarFallback>JT</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Jake Trefethen</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Building useful tools and applications. Currently focused on social media analytics and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {apps.map((app) => (
            <a 
              key={app.title} 
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{app.title}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                    <img 
                      src={app.image} 
                      alt={`${app.title} preview`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Jake Trefethen</h3>
              <p className="text-sm text-muted-foreground">
                Building tools for creators and businesses.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/jaketrefethen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/jaketrefethen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="mailto:hi@jaketrefethen.com" className="text-muted-foreground hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Jake Trefethen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 