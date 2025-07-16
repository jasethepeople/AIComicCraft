import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl font-bangers tracking-wider mb-4">
              <span className="text-primary">Comic</span><span className="text-secondary">AI</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transforming storytelling through AI-powered comic creation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Features</span></Link></li>
              <li><Link href="/pricing"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</span></Link></li>
              <li><Link href="/marketplace"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Marketplace</span></Link></li>
              <li><Link href="/nft"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">NFT Integration</span></Link></li>
              <li><Link href="/api"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">API</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</span></Link></li>
              <li><Link href="/tutorials"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Tutorials</span></Link></li>
              <li><Link href="/documentation"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Documentation</span></Link></li>
              <li><Link href="/community"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Community</span></Link></li>
              <li><Link href="/support"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Support</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/careers"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Careers</span></Link></li>
              <li><Link href="/privacy"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/terms"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span></Link></li>
              <li><Link href="/contact"><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} ComicAI. All rights reserved. AI-generated content subject to our terms of service.</p>
          <p className="text-gray-400">
            Made with ❤️ by <a href="https://jason-clark.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">Jason Clark</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
