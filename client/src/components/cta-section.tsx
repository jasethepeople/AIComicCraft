import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 banner-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-bangers text-4xl md:text-5xl mb-6">
          Start Your Comic Creation Journey Today!
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join thousands of creators bringing their stories to life with our AI-powered comic creation platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/creator-studio">
            <Button className="bg-white text-primary hover:bg-opacity-90 font-bold px-8 py-4 rounded-lg text-lg shadow-lg w-full sm:w-auto">
              Create Your First Comic Free
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="outline" className="border-2 border-white hover:bg-white hover:text-primary font-bold px-8 py-4 rounded-lg text-lg transition-all w-full sm:w-auto">
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
