'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingFormProps {
  selectedDate: Date | null
  onClose: () => void
  onBookingCreated: (booking: any) => void
}

export default function BookingForm({ selectedDate, onClose, onBookingCreated }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    phone: '',
    address: '',
    type: 'residential',
    startTime: '',
    endTime: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const startDateTime = selectedDate ? new Date(selectedDate) : new Date()
      if (formData.startTime) {
        const [hours, minutes] = formData.startTime.split(':')
        startDateTime.setHours(parseInt(hours), parseInt(minutes))
      }

      const endDateTime = new Date(startDateTime)
      if (formData.endTime) {
        const [hours, minutes] = formData.endTime.split(':')
        endDateTime.setHours(parseInt(hours), parseInt(minutes))
      } else {
        endDateTime.setHours(startDateTime.getHours() + 2) // Default 2 hours
      }

      const booking = {
        customer: formData.customer,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        type: formData.type,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        notes: formData.notes,
        status: 'pending'
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })

      if (response.ok) {
        const result = await response.json()
        onBookingCreated(result.booking)
        onClose()
      } else {
        throw new Error('Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>New Booking</CardTitle>
          <CardDescription>
            {selectedDate && `Selected Date: ${selectedDate.toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <input 
                type="text" 
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Address *</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter service address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Type *</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="residential">Residential Cleaning</option>
                <option value="commercial">Commercial Cleaning</option>
                <option value="deep">Deep Cleaning</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input 
                  type="time" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input 
                  type="time" 
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Any special instructions or notes..."
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Booking'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
