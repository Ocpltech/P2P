import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Receipt, 
  Building2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Receipt, label: 'Transactions', path: '/transactions' },
  { icon: Building2, label: 'Bank Accounts', path: '/bank-accounts' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-card transition-all duration-300",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex h-full flex-col border-r">
        <div className="flex h-16 items-center justify-between px-4">
          {isOpen && <h1 className="text-xl font-bold">PayGate</h1>}
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-accent"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground",
                  !isOpen && "justify-center"
                )}
              >
                <Icon className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}