import { createClient } from '@supabase/supabase-js'

// Supabase configuration - using the actual keys from the project
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc'

const supabase = createClient(supabaseUrl, supabaseKey)

// Category mapping based on product names and descriptions
const categoryMapping = {
  // Halloween products
  halloween: [
    'halloween', 'spooky', 'ghost', 'witch', 'pumpkin', 'scary', 'trick or treat',
    'candy corn', 'monster', 'zombie', 'vampire', 'skeleton', 'bat', 'spider',
    'chucky', 'michael myers', 'universal'
  ],
  
  // Chocolate products
  chocolate: [
    'chocolate', 'cocoa', 'milk chocolate', 'dark chocolate', 'white chocolate',
    'chocolate bar', 'chocolate chip', 'chocolate covered', 'truffle', 'bonbon',
    'chocolate cone', 'chocolate filling', 'dubai chocolate', 'labubu chocolate'
  ],
  
  // Cookies and baked goods
  cookies: [
    'cookie', 'biscuit', 'cracker', 'wafer', 'shortbread', 'gingerbread',
    'macaron', 'madeleine', 'brownie', 'muffin', 'cupcake', 'cake',
    'oreo', 'pocky', 'kit kat', 'hello panda', 'ritz', 'meiji'
  ],
  
  // Chips and salty snacks
  chips: [
    'chip', 'crisp', 'potato', 'corn', 'tortilla', 'pita', 'pretzel',
    'cracker', 'nuts', 'seeds', 'popcorn', 'rice cracker', 'savory',
    'lay\'s', 'cheetos', 'doritos', 'buldak potato', 'bbq chips', 'kobe steak',
    'fried chicken', 'grilled ribs', 'tasting adventure'
  ],
  
  // General sweets and candies
  sweets: [
    'candy', 'sweet', 'gummy', 'jelly', 'marshmallow', 'lollipop', 'hard candy',
    'caramel', 'toffee', 'fudge', 'nougat', 'licorice', 'taffy', 'gum',
    'mochi', 'moon pie', 'mint', 'skittles', 'freeze dried', 'swirly pop',
    'cannoli', 'lazy day', 'watermelon rings', 'peelerz', 'pelon', 'skwinkles',
    'barbie', 'rilakkuma', 'demon slayer', 'pusheen', 'cowboy boot'
  ],
  
  // Spicy products
  spicy: [
    'spicy', 'hot', 'chili', 'pepper', 'wasabi', 'sriracha', 'jalapeño',
    'habanero', 'ghost pepper', 'spice', 'fiery', 'burning', 'heat',
    'buldak', 'lime', 'tajin', 'tapatio', 'carne asada', 'chilito', 'tamarindo',
    'samyang', 'lucas', 'jarritos', 'snak club'
  ],
  
  // Drinks and beverages
  drinks: [
    'drink', 'beverage', 'soda', 'juice', 'tea', 'coffee', 'energy drink',
    'sports drink', 'water', 'lemonade', 'cola', 'fizzy', 'carbonated',
    'binggrae', 'ramune', 'fanta', 'coca-cola', 'pocari sweat', 'hydration',
    'electrolytes', 'cherry blossom', 'blue raspberry', 'milk', 'flavored milk',
    'strawberry milk', 'banana milk', 'taro milk', 'hawaiian blue', 'peach soda',
    'orange', 'grape', 'watermelon', 'qdol', 'pokemon'
  ]
}

async function organizeProductsByCategories() {
  try {
    console.log('🚀 Starting product organization by categories...')
    
    // Get all active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
    
    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`)
    }
    
    console.log(`📦 Found ${products.length} products to organize`)
    
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    
    if (categoriesError) {
      throw new Error(`Error fetching categories: ${categoriesError.message}`)
    }
    
    console.log(`📂 Found ${categories.length} categories`)
    
    // Create category lookup
    const categoryLookup = {}
    categories.forEach(cat => {
      categoryLookup[cat.slug] = cat.id
    })
    
    let updatedCount = 0
    let skippedCount = 0
    
    // Process each product
    for (const product of products) {
      const productText = `${product.name} ${product.description || ''}`.toLowerCase()
      
      let matchedCategory = null
      let bestMatch = 0
      
      // Find the best matching category with priority rules
      for (const [categorySlug, keywords] of Object.entries(categoryMapping)) {
        if (!categoryLookup[categorySlug]) continue
        
        let matchCount = 0
        let hasExactMatch = false
        
        keywords.forEach(keyword => {
          if (productText.includes(keyword)) {
            matchCount++
            // Check for exact word matches (higher priority)
            const regex = new RegExp(`\\b${keyword}\\b`, 'i')
            if (regex.test(productText)) {
              hasExactMatch = true
            }
          }
        })
        
        // Priority rules to avoid mis-categorization
        let priorityScore = matchCount
        
        // Drinks have highest priority for beverage-related products
        if (categorySlug === 'drinks' && (productText.includes('milk') || productText.includes('soda') || productText.includes('drink') || productText.includes('beverage'))) {
          priorityScore += 10
        }
        
        // Sweets have high priority for dessert-like products
        if (categorySlug === 'sweets' && (productText.includes('mochi') || productText.includes('moon pie') || productText.includes('marshmallow') || productText.includes('candy'))) {
          priorityScore += 8
        }
        
        // Chips should only match actual chip products
        if (categorySlug === 'chips' && !productText.includes('chip') && !productText.includes('crisp') && !productText.includes('potato') && !productText.includes('lay') && !productText.includes('cheetos') && !productText.includes('doritos')) {
          priorityScore = 0
        }
        
        // Chocolate products should not be in chips
        if (categorySlug === 'chips' && productText.includes('chocolate')) {
          priorityScore = 0
        }
        
        if (priorityScore > bestMatch) {
          bestMatch = priorityScore
          matchedCategory = categorySlug
        }
      }
      
      // Update product category if we found a match
      if (matchedCategory && bestMatch > 0) {
        const categoryId = categoryLookup[matchedCategory]
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: categoryId })
          .eq('id', product.id)
        
        if (updateError) {
          console.error(`❌ Error updating product ${product.name}:`, updateError.message)
        } else {
          console.log(`✅ Updated "${product.name}" → ${matchedCategory} (${bestMatch} matches)`)
          updatedCount++
        }
      } else {
        console.log(`⏭️  Skipped "${product.name}" - no category match found`)
        skippedCount++
      }
    }
    
    console.log('\n🎉 Product organization completed!')
    console.log(`✅ Updated: ${updatedCount} products`)
    console.log(`⏭️  Skipped: ${skippedCount} products`)
    console.log(`📊 Total processed: ${products.length} products`)
    
  } catch (error) {
    console.error('❌ Error organizing products:', error.message)
    process.exit(1)
  }
}

// Run the script
organizeProductsByCategories()
