import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://omitabgbgmawzzswespr.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taXRhYmdiZ21hd3p6c3dlc3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjAyMTY4OSwiZXhwIjoyMDM3NTk3Njg5fQ.bh6DZZbeq_xTA_px6nc5irbE95o2QhYChYy2u6rA-xc'
);
