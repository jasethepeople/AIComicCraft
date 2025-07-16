export default function FeaturesSection() {
  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-12">
          Create Comics in <span className="text-primary">Three Simple Steps</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift card-interactive group">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:bg-opacity-20 transition-all duration-300">
              <span className="font-bangers text-3xl text-primary group-hover:scale-110 transition-transform duration-300">1</span>
            </div>
            <h3 className="font-bold text-xl mb-3">Input Your Story</h3>
            <p className="text-gray-600 mb-4">
              Describe your characters, plot, and preferred art style. Our AI understands detailed prompts and creative direction.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-primary mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"></path><path d="M15 2v4"></path><path d="M9 2v4"></path><path d="M9 11h6"></path><path d="M9 15h6"></path></svg>
                <span className="font-medium">Story Elements</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Characters</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Plot</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Setting</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Art Style</span>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift card-interactive group">
            <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:bg-opacity-20 transition-all duration-300">
              <span className="font-bangers text-3xl text-secondary group-hover:scale-110 transition-transform duration-300">2</span>
            </div>
            <h3 className="font-bold text-xl mb-3">AI Generates Your Comic</h3>
            <p className="text-gray-600 mb-4">
              Our AI engine creates consistent characters, stunning backgrounds, and compelling storylines that match your vision.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 10 10 0 0 0 0-18z"></path><path d="M12 8v8"></path></svg>
                <span className="font-medium">Generated Content</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Panels</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Characters</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Dialogue</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Layouts</span>
              </div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover-lift card-interactive group">
            <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent group-hover:bg-opacity-20 transition-all duration-300">
              <span className="font-bangers text-3xl text-accent group-hover:scale-110 transition-transform duration-300">3</span>
            </div>
            <h3 className="font-bold text-xl mb-3">Edit & Publish</h3>
            <p className="text-gray-600 mb-4">
              Fine-tune generated content, add finishing touches, and publish to our marketplace or export for personal use.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-accent mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                <span className="font-medium">Distribution Options</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Digital</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Print</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">NFT</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">Social</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
