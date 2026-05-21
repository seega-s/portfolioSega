const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  // Update AWS
  let { error: err1 } = await supabase
    .from('experience_nodes')
    .update({ position_y: 360 })
    .eq('id', '54b95892-baf1-45f6-b0d6-320921472803');
  console.log('AWS updated:', err1);
  
  // Update Claude slightly
  let { error: err2 } = await supabase
    .from('experience_nodes')
    .update({ position_y: 230 })
    .eq('id', 'b2b842e7-4d4a-4349-95a3-e2ceedf82fd6');
  console.log('Claude updated:', err2);
  
  // Update Maibound slightly lower
  let { error: err3 } = await supabase
    .from('experience_nodes')
    .update({ position_y: 200 })
    .eq('id', '9df396b8-3964-4f08-bf3e-2b5f083b5a9c');
  console.log('Maibound updated:', err3);
}

main();
