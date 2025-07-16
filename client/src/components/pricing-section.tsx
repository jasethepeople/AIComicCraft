import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for beginners and casual creators",
      price: 0,
      features: [
        "5 AI-generated comics per month",
        "Basic art styles",
        "Standard resolution export",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonLink: "/register",
      popular: false
    },
    {
      name: "Creator Pro",
      description: "For serious hobbyists and creators",
      price: 19,
      features: [
        "Unlimited AI-generated comics",
        "All art styles and templates",
        "High-resolution export",
        "Priority generation queue",
        "Email support"
      ],
      buttonText: "Choose Pro",
      buttonLink: "/register?plan=pro",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For professional studios and educators",
      price: 49,
      features: [
        "Everything in Pro",
        "Team collaboration features",
        "Commercial usage rights",
        "NFT minting capabilities",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-4">
          Start Creating <span className="text-primary">Today</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Choose the plan that works for your creative goals, from casual hobbyists to professional creators.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                ${plan.popular ? "bg-primary bg-opacity-5 border-2 border-primary transform scale-105 shadow-xl" : "bg-light border border-gray-200"}
                rounded-xl overflow-hidden relative
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1">
                  POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-success mt-1 mr-2 h-5 w-5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.buttonLink}>
                  <Button 
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-opacity-90" : "bg-dark hover:bg-opacity-80"} text-white font-bold py-3 rounded-lg`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
