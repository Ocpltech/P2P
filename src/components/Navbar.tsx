import { Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Welcome back, Admin</h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="h-8 w-8 rounded-full bg-primary/10">
            <span className="flex h-full w-full items-center justify-center text-sm font-medium">
              A
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}