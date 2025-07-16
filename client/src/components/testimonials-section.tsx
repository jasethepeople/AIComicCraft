import { Star, StarHalf } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Hobbyist Creator",
      testimonial: "I've always wanted to create comics but couldn't draw. ComicAI changed everything - now I'm publishing my fantasy series and building a following!",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "English Teacher",
      testimonial: "I use ComicAI with my students to create visual stories. It's transformed how we approach creative writing and engagement has skyrocketed.",
      rating: 4.5
    },
    {
      name: "Jessica Rodriguez",
      role: "Professional Writer",
      testimonial: "As a writer looking to break into comics, the cost of artists was prohibitive. Now I can visualize my scripts instantly and focus on storytelling.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-4">
          Stories From Our <span className="text-secondary">Creator Community</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          See how creators of all skill levels are using ComicAI to bring their stories to life.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-dark">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "{testimonial.testimonial}"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <Star key={i} className="fill-current" />
                ))}
                {testimonial.rating % 1 !== 0 && (
                  <StarHalf className="fill-current" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
