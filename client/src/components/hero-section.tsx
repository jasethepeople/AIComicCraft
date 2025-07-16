import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="banner-gradient text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="font-bangers text-4xl md:text-6xl leading-tight mb-6">
              Transform Your Stories Into <span className="text-accent">Amazing</span> Comics With AI
            </h1>
            <p className="text-lg mb-8 max-w-lg">
              Create stunning digital comics and graphic novels in minutes, not months. Our AI-powered platform does the heavy lifting so you can focus on storytelling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/creator-studio">
                <Button className="bg-accent hover:bg-opacity-90 text-white font-bold px-6 py-3 rounded-lg text-lg shadow-lg w-full sm:w-auto hover-bounce hover:shadow-[0_10px_30px_rgba(0,200,83,0.4)] transition-all duration-300">
                  Create Your First Comic
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" className="border-2 border-white hover:bg-white hover:text-primary font-bold px-6 py-3 rounded-lg text-lg w-full sm:w-auto hover:scale-105 transition-all duration-300">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <svg 
                className="absolute -top-4 -left-4 z-0 text-white/20" 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                <path d="M3 15H21" stroke="currentColor" strokeWidth="2" />
                <path d="M9 21V3" stroke="currentColor" strokeWidth="2" />
                <path d="M15 21V3" stroke="currentColor" strokeWidth="2" />
              </svg>
              
              <svg 
                className="absolute -bottom-4 -right-4 z-0 text-white/20" 
                width="60" 
                height="60" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.5 9C14.5 9 13.7609 8 11.9999 8C8.99995 8 8.99995 11 8.99995 11C8.99995 11 8.99995 14 11.9999 14C14.9999 14 14.5 11 14.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 14.5V14.5C5.067 14.5 3.5 12.933 3.5 11V11C3.5 9.067 5.067 7.5 7 7.5V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
              </svg>
              
              <img 
                src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Comic book creation example" 
                className="rounded-xl shadow-2xl transform -rotate-2 mx-auto relative z-10 hover:rotate-0 hover:scale-105 transition-all duration-500 ease-out float-animation"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
