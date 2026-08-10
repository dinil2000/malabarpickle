import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let orders = await db.getOrders();
    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
      paymentMethod,
      notes
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Customer information, address, and items are required' },
        { status: 400 }
      );
    }

    const order = await db.createOrder({
      userId: userId || 'guest-user',
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      shippingAddress,
      items,
      subtotal: subtotal || totalAmount,
      discountAmount: discountAmount || 0,
      deliveryFee: deliveryFee || 0,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'WhatsApp' ? 'COD' : 'Paid',
      orderStatus: 'Placed',
      notes
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully!',
      order
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
