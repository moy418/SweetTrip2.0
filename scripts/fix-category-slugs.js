import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc'

const supabase = createClient(supabaseUrl, supabaseKey)

// Correct category slugs
const categorySlugMappings = {
  'chocolate-bars': 'chocolate',
  'sodas': 'drinks',
  'Sweets': 'sweets'
}

async function fixCategorySlugs() {
  try {
    console.log('🚀 Starting category slug fixes...')
    
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
    
    if (categoriesError) {
      throw new Error(`Error fetching categories: ${categoriesError.message}`)
    }
    
    console.log('📂 Found categories:')
    categories.forEach(cat => console.log(`- ${cat.name} (${cat.slug})`))
    
    let updatedCount = 0
    
    // Update category slugs
    for (const [oldSlug, newSlug] of Object.entries(categorySlugMappings)) {
      const { error: updateError } = await supabase
        .from('categories')
        .update({ slug: newSlug })
        .eq('slug', oldSlug)
      
      if (updateError) {
        console.error(`❌ Error updating category slug "${oldSlug}":`, updateError.message)
      } else {
        console.log(`✅ Updated category slug: "${oldSlug}" → "${newSlug}"`)
        updatedCount++
      }
    }
    
    // Create missing categories
    const requiredCategories = [
      { name: 'Halloween', slug: 'halloween', description: 'Spooky and Halloween-themed treats' }
    ]
    
    for (const category of requiredCategories) {
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          is_active: true
        })
      
      if (insertError) {
        console.error(`❌ Error creating category "${category.name}":`, insertError.message)
      } else {
        console.log(`✅ Created category: "${category.name}" (${category.slug})`)
        updatedCount++
      }
    }
    
    console.log('\n🎉 Category slug fixes completed!')
    console.log(`✅ Updated/Created: ${updatedCount} categories`)
    
  } catch (error) {
    console.error('❌ Error fixing category slugs:', error.message)
    process.exit(1)
  }
}

// Run the script
fixCategorySlugs()
