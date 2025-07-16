import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { getInitials } from "@/lib/utils";
import { Menu, X, UserCircle, LogOut, Settings, Zap, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    onError: () => null
  });

  // Fetch credit balance for authenticated users
  const { data: creditBalance } = useQuery({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
    onError: () => null
  });

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    setLocation("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const [currentLocation] = useLocation();
    const isActive = currentLocation === href;
    
    return (
      <Link href={href}>
        <a className={`text-white hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>
          {children}
        </a>
      </Link>
    );
  };

  return (
    <header className="bg-dark text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-3xl font-bangers tracking-wider mr-2">
              <span className="text-primary">Comic</span>
              <span className="text-secondary">AI</span>
            </a>
          </Link>
          <span className="hidden md:inline text-sm bg-accent text-white px-2 py-1 rounded-full">
            BETA
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/creator-studio">Comics</NavLink>
          <NavLink href="/anime-studio">Anime</NavLink>
          <NavLink href="/marketplace">Marketplace</NavLink>
          <NavLink href="/social-preview">Social</NavLink>
          <NavLink href="/community">Community</NavLink>
          <NavLink href="/learn">Learn</NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Credit Balance Display for Authenticated Users */}
          {user && creditBalance && (
            <Link href="/credits">
              <Button variant="ghost" className="text-white hover:text-secondary flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{creditBalance.credits}</span>
                <Badge variant="secondary" className="text-xs">
                  {creditBalance.subscriptionTier === "lifetime" ? "∞" : creditBalance.subscriptionTier}
                </Badge>
              </Button>
            </Link>
          )}

          {!user ? (
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-secondary">
                Log In
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarFallback className="bg-gray-200 text-dark">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/credits">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Credits & Billing</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/creator-studio">
            <Button className="hidden md:block bg-primary hover:bg-opacity-80 text-white">
              Start Creating
            </Button>
          </Link>

          <button onClick={toggleMobileMenu} className="md:hidden">
            {mobileMenuOpen ? (
              <X className="text-2xl" />
            ) : (
              <Menu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark border-t border-gray-700 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/">
              <a className="text-white hover:text-secondary transition-colors">Home</a>
            </Link>
            <Link href="/creator-studio">
              <a className="text-white hover:text-secondary transition-colors">Comics</a>
            </Link>
            <Link href="/anime-studio">
              <a className="text-white hover:text-secondary transition-colors">Anime</a>
            </Link>
            <Link href="/marketplace">
              <a className="text-white hover:text-secondary transition-colors">Marketplace</a>
            </Link>
            <Link href="/social-preview">
              <a className="text-white hover:text-secondary transition-colors">Social</a>
            </Link>
            <Link href="/community">
              <a className="text-white hover:text-secondary transition-colors">Community</a>
            </Link>
            <Link href="/learn">
              <a className="text-white hover:text-secondary transition-colors">Learn</a>
            </Link>
            
            <Link href="/creator-studio">
              <Button className="w-full bg-primary hover:bg-opacity-80 text-white">
                Start Creating
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
