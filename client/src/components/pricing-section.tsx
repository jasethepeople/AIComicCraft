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
        "10 free credits to start",
        "Basic art styles",
        "Standard resolution export",
        "Community support",
        "Social media preview generator"
      ],
      buttonText: "Get Started",
      buttonLink: "/register",
      popular: false
    },
    {
      name: "Basic",
      description: "Great for regular creators",
      price: 2.99,
      features: [
        "50 credits per month",
        "All art styles and templates",
        "High-resolution export",
        "Priority generation queue",
        "Email support"
      ],
      buttonText: "Choose Basic",
      buttonLink: "/register?plan=basic",
      popular: true
    },
    {
      name: "Pro",
      description: "For serious creators and small studios",
      price: 7.99,
      features: [
        "200 credits per month",
        "Everything in Basic",
        "Commercial usage rights",
        "Advanced editing tools",
        "Priority support"
      ],
      buttonText: "Choose Pro",
      buttonLink: "/register?plan=pro",
      popular: false
    },
    {
      name: "Lifetime",
      description: "One-time payment, lifetime access",
      price: 99.99,
      features: [
        "2000 credits per month",
        "All Pro features",
        "Lifetime access",
        "No monthly fees",
        "Exclusive content",
        "Early access to new features"
      ],
      buttonText: "Get Lifetime",
      buttonLink: "/register?plan=lifetime",
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
        
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                  <span className="text-gray-500">{plan.name === "Lifetime" ? " one-time" : "/month"}</span>
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
