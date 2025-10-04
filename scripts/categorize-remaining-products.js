import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc'

const supabase = createClient(supabaseUrl, supabaseKey)

// Manual categorization for remaining products
const manualCategorization = {
  // Drinks
  'Bamboo House Double Filling Mochi Strawberry Milk 6.3 oz': 'drinks',
  'Bamboo House Double Filling Mochi Cantaloupe Milk 6.3 oz': 'drinks',
  'Bamboo House Double Filling Mochi Mango Milk 6.3 oz': 'drinks',
  'Binggrae Korea\'s #1 Flavored Milk-6.8oz (4x6, 24 Packs): Strawberry': 'drinks',
  'Binggrae Korea\'s #1 Flavored Milk-6.8oz (4x6, 24 Packs): Banana': 'drinks',
  'Binggrae Korea\'s #1 Flavored Milk-6.8oz (4x6, 24 Packs): Taro': 'drinks',
  'Ramune Hawaiian Blue (Fuji), Glass Bottle 30ct': 'drinks',
  'Ramune Orange, 6.76oz Glass Bottle 30ct': 'drinks',
  'QDOL Pokemon Peach Soda': 'drinks',
  'Fanta 500ml (CHINA): Grape': 'drinks',
  'Fanta 500ml (CHINA): Watermelon': 'drinks',
  'Coca-Cola 500ml (CHINA): Peach': 'drinks',
  'Rilakkuma Cherry Blossom Drink, 12ct': 'drinks',
  'Pusheen I\'m Busy Blue Raspberry fizzy Drink, 12ct': 'drinks',
  'POCARI SWEAT Hydration Drink w/ Electrolytes 16.9 oz - 24 pk': 'drinks',
  
  // Sweets
  'Moon Pie Blueberry, Double Decker Pies 2.75oz 12ct': 'sweets',
  'Rilakkuma Marshmallow Lazy Day Sweets Candy Tin, 12ct': 'sweets',
  'Demon Slayer Vanilla Mochi, 120g bag, 12ct': 'sweets',
  'Demon Slayer Strawberry Mochi, 120g bag, 12ct': 'sweets',
  'Candy Paradise Freeze Dried Skitties 3 oz': 'sweets',
  'Barbie Swirly Pop': 'sweets',
  'Cannoli filled 4 pcs': 'sweets',
  'Cannoli filled 6 pcs': 'sweets',
  'Hello Kitty Milk Soft Candy': 'sweets',
  'Amos Peelerz Mango 6 oz': 'sweets',
  'Amos Peelerz Peach 6 oz': 'sweets',
  'El Super Leon Coco Leche': 'sweets',
  
  // Chocolate
  'LABUBU Angel Hair Dubai Chocolate Bar - Pink Cotton Candy': 'chocolate',
  'Dubai Chocolate Bar Pistachio by Oasis Treasures Made in USA': 'chocolate',
  'Viral Labubu Dubai Chocolate Bar  - 3.52 oz': 'chocolate',
  'Viral LABUBU Chocolate Bar -Chocolate Filling 2.65 OZ': 'chocolate',
  'Dubai Style Chocolate (100 g)': 'chocolate',
  'Dubai Pistachio Chocolate Cones': 'chocolate',
  'Prinzessin Haar Schokolade': 'chocolate',
  
  // Halloween
  'Universal Chucky & Michael Myers Candy Case': 'halloween',
  
  // Remove invalid product
  'as': null
}

async function categorizeRemainingProducts() {
  try {
    console.log('🚀 Starting manual categorization of remaining products...')
    
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    
    if (categoriesError) {
      throw new Error(`Error fetching categories: ${categoriesError.message}`)
    }
    
    // Create category lookup
    const categoryLookup = {}
    categories.forEach(cat => {
      categoryLookup[cat.slug] = cat.id
    })
    
    let updatedCount = 0
    let skippedCount = 0
    let deletedCount = 0
    
    // Process each manual categorization
    for (const [productName, categorySlug] of Object.entries(manualCategorization)) {
      if (categorySlug === null) {
        // Delete invalid product
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('name', productName)
        
        if (deleteError) {
          console.error(`❌ Error deleting product "${productName}":`, deleteError.message)
        } else {
          console.log(`🗑️  Deleted invalid product: "${productName}"`)
          deletedCount++
        }
        continue
      }
      
      if (!categoryLookup[categorySlug]) {
        console.error(`❌ Category "${categorySlug}" not found for product "${productName}"`)
        continue
      }
      
      const categoryId = categoryLookup[categorySlug]
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_id: categoryId })
        .eq('name', productName)
      
      if (updateError) {
        console.error(`❌ Error updating product "${productName}":`, updateError.message)
      } else {
        console.log(`✅ Updated "${productName}" → ${categorySlug}`)
        updatedCount++
      }
    }
    
    console.log('\n🎉 Manual categorization completed!')
    console.log(`✅ Updated: ${updatedCount} products`)
    console.log(`🗑️  Deleted: ${deletedCount} products`)
    console.log(`📊 Total processed: ${Object.keys(manualCategorization).length} products`)
    
  } catch (error) {
    console.error('❌ Error categorizing products:', error.message)
    process.exit(1)
  }
}

// Run the script
categorizeRemainingProducts()
