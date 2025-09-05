'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testBlobUpload = async () => {
    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `test-${Date.now()}.txt`,
          content: 'Hello from Luxe Cleanings! This is a test upload to Vercel Blob storage.'
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setResult(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Vercel Blob Storage Demo</CardTitle>
            <CardDescription>
              Test the Vercel Blob integration by uploading a sample file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testBlobUpload} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Test Blob Upload'}
            </Button>

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Upload Successful!</h3>
                <p className="text-sm text-green-700 mb-2">File URL:</p>
                <a 
                  href={result} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {result}
                </a>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="font-semibold text-red-800 mb-2">Upload Failed</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Environment Setup</h3>
              <p className="text-sm text-gray-600">
                Make sure you have set the BLOB_READ_WRITE_TOKEN environment variable 
                in your .env.local file or Vercel deployment settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
