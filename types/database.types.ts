export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  org_id: string;
  role: 'admin' | 'member' | 'viewer';
  created_at: string;
  last_login?: string | null;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  description?: string | null;
  color: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  start_date: string;
  end_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  parent_id?: string | null;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  start_date: string;
  end_date: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
  created_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  task_id?: string | null;
  project_id?: string | null;
  action: string;
  metadata?: Record<string, any> | null;
  created_at: string;
}

// Extended types with relations
export interface ProjectWithTasks extends Project {
  tasks?: Task[];
}

export interface TaskWithRelations extends Task {
  assigned_user?: User;
  dependencies?: TaskDependency[];
  comments?: Comment[];
  project?: Project;
}

export interface GanttTask {
  id: string;
  text: string;
  start_date: string;
  duration: number;
  progress: number;
  parent?: string | null;
  type?: 'task' | 'milestone';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  color?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
}
