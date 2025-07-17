import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company?: string
  content: string
  rating: number
  image?: string
}

interface TestimonialsProps {
  className?: string
}

export function Testimonials({ className }: TestimonialsProps) {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      company: "Tech Solutions Inc.",
      content: "PomoNest completely transformed my productivity. I went from struggling to focus for 10 minutes to easily completing 6-8 Pomodoros per day. The streak tracking keeps me motivated!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "College Student",
      content: "As someone with ADHD, focusing has always been challenging. PomoNest's 25-minute sessions are perfect - not too long to feel overwhelming, but long enough to get real work done. My grades have improved significantly!",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Freelance Designer",
      content: "I love that I can start using PomoNest immediately without creating an account. The interface is clean and distraction-free, which is exactly what I needed. The Pro features are worth every penny.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Research Scientist",
      content: "The analytics feature in PomoNest Pro helps me identify my most productive hours. I now schedule my hardest tasks during my peak times. It's like having a personal productivity coach.",
      rating: 5
    },
    {
      name: "Jessica Thompson",
      role: "Content Writer",
      company: "Digital Marketing Agency",
      content: "I was skeptical about the Pomodoro Technique, but PomoNest made it so easy to try. Three months later, I'm writing 40% more content and feeling less stressed. The guided breaks are a game-changer.",
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      role: "Medical Student",
      content: "Studying for medical school requires intense focus. PomoNest helps me maintain concentration during long study sessions. The streak protection feature saved me during finals week when I got sick!",
      rating: 5
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className={`py-12 ${className || ''}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of focused minds who have transformed their productivity with PomoNest
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col h-full">
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-50" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="mt-auto">
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                  {testimonial.company && (
                    <span className="text-muted-foreground/80">
                      {" • "}{testimonial.company}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 text-center">
        <div className="grid gap-8 md:grid-cols-3 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Sessions Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}