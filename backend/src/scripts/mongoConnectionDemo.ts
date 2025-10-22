import mongoose from 'mongoose';
import 'dotenv/config';

// MongoDB connection function
async function connectToMongoDB(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not set. Please set it in your .env file');
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'groupmirror',
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connected successfully!');

    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

// Sample schema for a new collection/table
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'books', 'home', 'sports']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create the model (this creates the collection if it doesn't exist)
const Product = mongoose.model('Product', ProductSchema);

// Interface for TypeScript type safety
interface IProduct {
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'sports';
  inStock?: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Function to create a new product document
async function createProduct(productData: IProduct) {
  try {
    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log('✅ Product created successfully:', savedProduct);
    return savedProduct;
  } catch (error) {
    console.error('❌ Error creating product:', error);
    throw error;
  }
}

// Function to get all products
async function getAllProducts() {
  try {
    const products = await Product.find();
    console.log('📋 All products:', products);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
}

// Function to get products by category
async function getProductsByCategory(category: string) {
  try {
    const products = await Product.find({ category });
    console.log(`📋 Products in ${category} category:`, products);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    throw error;
  }
}

// Function to update a product
async function updateProduct(productId: string, updateData: Partial<IProduct>) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    
    console.log('✅ Product updated successfully:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
}

// Function to delete a product
async function deleteProduct(productId: string) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      throw new Error('Product not found');
    }
    
    console.log('✅ Product deleted successfully:', deletedProduct);
    return deletedProduct;
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
}

// Function to demonstrate collection operations
async function demonstrateCollectionOperations() {
  try {
    console.log('\n🚀 Starting MongoDB Collection Operations Demo\n');

    // 1. Create some sample products
    console.log('1️⃣ Creating sample products...');
    await createProduct({
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      category: 'electronics',
      tags: ['wireless', 'audio', 'tech']
    });

    await createProduct({
      name: 'Running Shoes',
      description: 'Comfortable running shoes for all terrains',
      price: 129.99,
      category: 'sports',
      tags: ['running', 'athletic', 'comfort']
    });

    await createProduct({
      name: 'Programming Book',
      description: 'Learn JavaScript from scratch',
      price: 49.99,
      category: 'books',
      tags: ['programming', 'javascript', 'education']
    });

    // 2. Get all products
    console.log('\n2️⃣ Fetching all products...');
    await getAllProducts();

    // 3. Get products by category
    console.log('\n3️⃣ Fetching electronics products...');
    await getProductsByCategory('electronics');

    // 4. Update a product
    console.log('\n4️⃣ Updating a product...');
    const products = await Product.find();
    if (products.length > 0) {
      await updateProduct(products[0]._id.toString(), {
        price: 179.99,
        description: 'Updated description for wireless headphones'
      });
    }

    // 5. Show collection statistics
    console.log('\n5️⃣ Collection Statistics:');
    const stats = await mongoose.connection.db!.admin().command({ collStats: 'products' });
    console.log('📊 Collection Stats:', {
      name: stats.ns,
      count: stats.count,
      size: stats.size,
      avgObjSize: stats.avgObjSize
    });

    console.log('\n✅ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Function to list all collections in the database
async function listAllCollections() {
  try {
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('\n📋 All collections in the database:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    return collections;
  } catch (error) {
    console.error('❌ Error listing collections:', error);
    throw error;
  }
}

// Main function to run the demo
async function main() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // List existing collections
    await listAllCollections();
    
    // Demonstrate collection operations
    await demonstrateCollectionOperations();
    
    // List collections again to show the new one
    await listAllCollections();
    
  } catch (error) {
    console.error('❌ Main function failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Export functions for use in other files
export {
  connectToMongoDB,
  Product,
  createProduct,
  getAllProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  listAllCollections,
  demonstrateCollectionOperations
};

// Run the demo if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
