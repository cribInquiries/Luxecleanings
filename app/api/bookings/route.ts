import { put, list, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'residential' | 'commercial' | 'deep';
  status: 'pending' | 'confirmed' | 'completed';
  customer: string;
  address: string;
  phone?: string;
  email?: string;
  notes?: string;
}

// GET - Retrieve all bookings
export async function GET() {
  try {
    const { blobs } = await list();
    const bookingBlobs = blobs.filter(blob => blob.pathname.startsWith('bookings/'));
    
    const bookings: Booking[] = [];
    
    for (const blob of bookingBlobs) {
      try {
        const response = await fetch(blob.url);
        const booking = await response.json();
        bookings.push(booking);
      } catch (error) {
        console.error(`Error fetching booking ${blob.pathname}:`, error);
      }
    }
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const booking: Booking = await request.json();
    
    if (!booking.customer || !booking.start || !booking.end) {
      return NextResponse.json(
        { error: "Customer name, start time, and end time are required" },
        { status: 400 }
      );
    }

    // Generate unique ID if not provided
    if (!booking.id) {
      booking.id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate title if not provided
    if (!booking.title) {
      const serviceType = booking.type.charAt(0).toUpperCase() + booking.type.slice(1);
      booking.title = `${serviceType} Cleaning - ${booking.customer}`;
    }

    // Set default status if not provided
    if (!booking.status) {
      booking.status = 'pending';
    }

    const filename = `bookings/${booking.id}.json`;
    const { url } = await put(filename, JSON.stringify(booking, null, 2), { 
      access: 'public' 
    });
    
    return NextResponse.json({ 
      success: true, 
      booking: { ...booking, url },
      message: "Booking created successfully" 
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing booking
export async function PUT(request: NextRequest) {
  try {
    const booking: Booking = await request.json();
    
    if (!booking.id) {
      return NextResponse.json(
        { error: "Booking ID is required for updates" },
        { status: 400 }
      );
    }

    const filename = `bookings/${booking.id}.json`;
    const { url } = await put(filename, JSON.stringify(booking, null, 2), { 
      access: 'public' 
    });
    
    return NextResponse.json({ 
      success: true, 
      booking: { ...booking, url },
      message: "Booking updated successfully" 
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const filename = `bookings/${bookingId}.json`;
    await del(filename);
    
    return NextResponse.json({ 
      success: true,
      message: "Booking deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}