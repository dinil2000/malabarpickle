import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';
import { ProductModel } from '@/lib/models/Product';
import { CategoryModel } from '@/lib/models/Category';
import { OrderModel } from '@/lib/models/Order';

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({
      connected: false,
      reason: 'MONGODB_URI environment variable is missing in Vercel settings.'
    });
  }

  if (uri.includes('<db_password>')) {
    return NextResponse.json({
      connected: false,
      reason: 'MONGODB_URI contains "<db_password>". You need to replace it with your actual MongoDB password!'
    });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        connected: false,
        reason: 'Failed to connect to MongoDB Atlas. Please check Network Access (IP Whitelist 0.0.0.0/0) or database password.'
      });
    }

    const [userCount, productCount, categoryCount, orderCount] = await Promise.all([
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      CategoryModel.countDocuments(),
      OrderModel.countDocuments()
    ]);

    return NextResponse.json({
      connected: true,
      databaseName: conn.connection.name,
      stats: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        orders: orderCount
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error?.message || 'Unknown database connection error'
    });
  }
}
