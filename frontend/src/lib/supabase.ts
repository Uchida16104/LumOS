import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.lxwracacdahhfxrfchtu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface VirtualFile {
  id: string;
  owner_id: string;
  name: string;
  content: string;
  path: string;
  is_directory: boolean;
  size_bytes: number;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExecutionLog {
  id: string;
  user_id: string | null;
  language: string;
  code_snippet: string;
  output: string | null;
  status: string;
  execution_time_ms: number | null;
  created_at: string;
}

export interface NetworkLog {
  id: string;
  user_id: string | null;
  operation: string;
  target_host: string | null;
  request_data: any;
  response_data: any;
  status: string;
  created_at: string;
}

export interface DataAnalytic {
  id: string;
  user_id: string | null;
  operation: string;
  input_data: any;
  output_data: any;
  metadata: any;
  created_at: string;
}

export class SupabaseService {
  async getFiles(ownerId: string, path: string = '/'): Promise<VirtualFile[]> {
    try {
      const { data, error } = await supabase
        .from('virtual_files')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('path', path)
        .order('is_directory', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }

  async createFile(file: Partial<VirtualFile>): Promise<VirtualFile | null> {
    try {
      const { data, error } = await supabase
        .from('virtual_files')
        .insert([file])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating file:', error);
      return null;
    }
  }

  async updateFile(id: string, updates: Partial<VirtualFile>): Promise<VirtualFile | null> {
    try {
      const { data, error } = await supabase
        .from('virtual_files')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      return null;
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('virtual_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async logExecution(log: Partial<ExecutionLog>): Promise<ExecutionLog | null> {
    try {
      const { data, error } = await supabase
        .from('execution_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging execution:', error);
      return null;
    }
  }

  async getExecutionLogs(userId: string, limit: number = 50): Promise<ExecutionLog[]> {
    try {
      const { data, error } = await supabase
        .from('execution_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching execution logs:', error);
      return [];
    }
  }

  async logNetworkOperation(log: Partial<NetworkLog>): Promise<NetworkLog | null> {
    try {
      const { data, error } = await supabase
        .from('network_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging network operation:', error);
      return null;
    }
  }

  async logDataAnalytics(log: Partial<DataAnalytic>): Promise<DataAnalytic | null> {
    try {
      const { data, error } = await supabase
        .from('data_analytics')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging data analytics:', error);
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();

export default supabaseService;
