import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jxyazsguwkbklavamzyj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eWF6c2d1d2tia2xhdmFtenlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTI4MzMsImV4cCI6MjA4MDEyODgzM30.0udmTyDCvUrhhVDfQy4enClH7Cxif7gaX_V6RTZysAI'

export const supabase = createClient(supabaseUrl, supabaseKey)
