import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Code,
  Smartphone,
  TrendingUp,
  Palette,
  CheckCircle,
  ArrowRight,
  Globe,
  Database,
  Shield,
  Zap,
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      features: [
        "Responsive Design",
        "Modern Frameworks (React, Next.js)",
        "Database Integration",
        "API Development",
        "Performance Optimization",
        "SEO Optimization",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      features: [
        "iOS & Android Apps",
        "Cross-platform Solutions",
        "Native Performance",
        "Push Notifications",
        "Offline Functionality",
        "App Store Deployment",
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Strategic marketing campaigns that drive growth",
      features: [
        "Social Media Marketing",
        "Content Strategy",
        "SEO & SEM",
        "Email Marketing",
        "Analytics & Reporting",
        "Brand Development",
      ],
      technologies: ["Google Analytics", "Facebook Ads", "Google Ads", "Mailchimp"],
    },
    {
      icon: Palette,
      title: "UI/UX & Graphic Design",
      description: "Beautiful designs that enhance user experience",
      features: [
        "User Interface Design",
        "User Experience Research",
        "Brand Identity",
        "Logo Design",
        "Print Design",
        "Prototyping",
      ],
      technologies: ["Figma", "Adobe Creative Suite", "Sketch", "InVision"],
    },
  ]

  const additionalServices = [
    {
      icon: Globe,
      title: "E-commerce Solutions",
      description: "Complete online store development with payment integration",
    },
    {
      icon: Database,
      title: "Database Design",
      description: "Scalable database architecture and optimization",
    },
    {
      icon: Shield,
      title: "Security Audits",
      description: "Comprehensive security assessment and implementation",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Speed and performance improvements for existing applications",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to your business needs. From web development to digital marketing,
            we've got you covered.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <service.icon className="h-12 w-12 text-blue-600 mb-6" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                      <p className="text-lg text-gray-600 mb-6">{service.description}</p>

                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Technologies We Use:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl h-full flex items-center justify-center">
                    <service.icon className="h-32 w-32 text-blue-600 opacity-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We also offer specialized services to complement our core offerings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <service.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your requirements and create a solution that drives your business forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
