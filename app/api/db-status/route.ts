import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
    // Attempt direct connection with explicit error capture
    const conn = await mongoose.connect(uri, { bufferCommands: false });

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
      errorName: error?.name || 'UnknownError',
      errorMessage: error?.message || String(error),
      solutionHint: error?.message?.includes('auth') || error?.name?.includes('Auth')
        ? 'Authentication failed! Please check your MongoDB Database User password in Database Access or URL-encode special characters.'
        : 'Connection attempt failed.'
    });
  }
}
