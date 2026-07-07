/**
 * Database type definitions.
 * This file will be replaced with auto-generated types from Supabase CLI
 * once the database schema is created in Phase 2.
 *
 * To generate: npx supabase gen types typescript --project-id <your-project-id>
 */

// Placeholder type — will be replaced by Supabase CLI output
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
