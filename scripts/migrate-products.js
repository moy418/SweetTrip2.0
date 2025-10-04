const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simplified categories based on product analysis
const categories = [
  { name: 'Candies', slug: 'candies', description: 'Traditional and international candies' },
  { name: 'Chocolates', slug: 'chocolates', description: 'Premium chocolates and chocolate bars' },
  { name: 'Gummies', slug: 'gummies', description: 'Chewy gummy candies and treats' },
  { name: 'Hard Candy', slug: 'hard-candy', description: 'Hard candies and lollipops' },
  { name: 'Desserts', slug: 'desserts', description: 'Traditional desserts and pastries' },
  { name: 'Specialty', slug: 'specialty', description: 'Special and limited edition items' },
];

async function createCategories() {
  console.log('Creating categories...');
  
  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({
        name: category.name,
        slug: category.slug,
        description: category.description,
        is_active: true,
        sort_order: categories.indexOf(category) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'slug'
      });

    if (error) {
      console.error('Error creating category:', category.name, error);
    } else {
      console.log('Created/updated category:', category.name);
    }
  }
}

async function getCategoryId(categoryName) {
  // Map product categories to our simplified categories
  const categoryMap = {
    'candies': 'candies',
    'chocolates': 'chocolates',
    'chocolate': 'chocolates',
    'gummies': 'gummies',
    'gummy': 'gummies',
    'hard candy': 'hard-candy',
    'desserts': 'desserts',
    'dessert': 'desserts',
    'cannoli': 'desserts',
    'specialty': 'specialty',
    'special': 'specialty',
  };

  const slug = categoryMap[categoryName?.toLowerCase()] || 'candies';
  
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error getting category:', error);
    return null;
  }

  return data?.id;
}

async function migrateProducts() {
  console.log('Starting product migration...');
  
  const products = [];
  
  // Read CSV file
  fs.createReadStream('products_export_1(4).csv')
    .pipe(csv())
    .on('data', (row) => {
      // Only process rows with valid product data
      if (row.Handle && row.Title && row['Variant Price']) {
        products.push(row);
      }
    })
    .on('end', async () => {
      console.log(`Found ${products.length} products to migrate`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of products) {
        try {
          // Generate unique ID
          const id = `prod_${product.Handle}`;
          
          // Parse price
          const price = parseFloat(product['Variant Price']) || 0;
          const comparePrice = product['Variant Compare At Price'] ? 
            parseFloat(product['Variant Compare At Price']) : null;
          
          // Parse weight
          const weightGrams = product['Variant Grams'] ? 
            parseFloat(product['Variant Grams']) : null;
          
          // Get category
          const categoryId = await getCategoryId(product['Product Category']);
          
          // Clean description
          let description = product['Body (HTML)'] || '';
          // Remove HTML tags for cleaner description
          description = description.replace(/<[^>]*>/g, '').trim();
          
          // Create image URLs array
          const imageUrls = [];
          if (product['Image Src']) {
            imageUrls.push(product['Image Src']);
          }
          
          // Create tags array
          const tags = product.Tags ? 
            product.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
          
          // Determine if product is active
          const isActive = product.Published === 'true' && product.Status === 'active';
          
          // Stock quantity
          const stockQuantity = parseInt(product['Variant Inventory Qty']) || 0;
          
          const productData = {
            id,
            name: product.Title,
            description: description || null,
            price,
            compare_price: comparePrice,
            currency: 'USD',
            sku: product['Variant SKU'] || null,
            weight_grams: weightGrams,
            origin_country: null, // Will be filled later based on product analysis
            brand: product.Vendor || null,
            vendor: product.Vendor || null,
            image_urls: imageUrls,
            category_id: categoryId,
            tags,
            stock_quantity: stockQuantity,
            is_active: isActive,
            featured: false, // Will be determined later
            status: isActive ? 'active' : 'draft',
            handle: product.Handle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          const { error } = await supabase
            .from('products')
            .upsert(productData, {
              onConflict: 'handle'
            });
          
          if (error) {
            console.error('Error migrating product:', product.Title, error);
            errorCount++;
          } else {
            console.log('Migrated product:', product.Title);
            successCount++;
          }
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error('Error processing product:', product.Title, error);
          errorCount++;
        }
      }
      
      console.log(`\nMigration completed!`);
      console.log(`Successfully migrated: ${successCount} products`);
      console.log(`Errors: ${errorCount} products`);
      
      // Update featured products (first 6 active products)
      console.log('\nUpdating featured products...');
      const { data: featuredProducts, error: featuredError } = await supabase
        .from('products')
        .update({ featured: true })
        .eq('is_active', true)
        .limit(6);
      
      if (featuredError) {
        console.error('Error updating featured products:', featuredError);
      } else {
        console.log('Updated featured products');
      }
    });
}

async function main() {
  try {
    await createCategories();
    await migrateProducts();
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();



