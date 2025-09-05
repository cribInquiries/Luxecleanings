import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Luxe Cleanings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Professional cleaning services that bring luxury to your space
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg">
                Book Cleaning Service
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                Test Vercel Blob Integration
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Residential Cleaning</CardTitle>
              <CardDescription>
                Complete home cleaning services for your comfort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commercial Cleaning</CardTitle>
              <CardDescription>
                Professional office and commercial space cleaning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deep Cleaning</CardTitle>
              <CardDescription>
                Intensive cleaning for special occasions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
