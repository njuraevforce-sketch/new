import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fctwivbwjoslkejtjxhe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdHdpdmJ3am9zbGtlanRqeGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDMwMzUsImV4cCI6MjA4MTcxOTAzNX0.DiAzcqkigZPueh40idz2fIoJ-o-sKDMaRleOagH__B0'

const supabase = createClient(supabaseUrl, supabaseKey, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  },
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase
