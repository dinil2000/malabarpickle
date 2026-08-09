import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const spice = searchParams.get('spice');
    const isVeg = searchParams.get('isVeg');

    let products = db.getProducts();

    if (category) {
      products = products.filter(p => p.categoryId === category || p.categoryName.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.malayalamName?.includes(search)
      );
    }

    if (spice) {
      products = products.filter(p => p.spiceLevel.toLowerCase() === spice.toLowerCase());
    }

    if (isVeg !== null && isVeg !== undefined && isVeg !== '') {
      const vegBool = isVeg === 'true';
      products = products.filter(p => p.isVeg === vegBool);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, categoryId, categoryName, spiceLevel, isVeg, image, weights, ingredients } = body;

    if (!name || !description || !categoryId || !weights || weights.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProd = db.addProduct({
      name,
      slug,
      description,
      categoryId,
      categoryName: categoryName || 'General',
      spiceLevel: spiceLevel || 'Spicy',
      isVeg: isVeg ?? true,
      isBestseller: false,
      image: image || 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
      stockQuantity: 100,
      ingredients: ingredients || ['Raw Mango', 'Spices', 'Gingelly Oil', 'Salt'],
      weights: weights
    });

    return NextResponse.json({
      success: true,
      product: newProd
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
