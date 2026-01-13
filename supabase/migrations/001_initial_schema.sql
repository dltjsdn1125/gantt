-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_slug ON organizations(slug);

-- Create users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX idx_user_org ON users(org_id);
CREATE INDEX idx_user_email ON users(email);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#5B4FFF',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_org ON projects(org_id);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_project_dates ON projects(start_date, end_date);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_project ON tasks(project_id);
CREATE INDEX idx_task_assigned ON tasks(assigned_to);
CREATE INDEX idx_task_parent ON tasks(parent_id);
CREATE INDEX idx_task_dates ON tasks(start_date, end_date);

-- Create task_dependencies table
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'finish_to_start' 
    CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_dependency_task ON task_dependencies(task_id);
CREATE INDEX idx_dependency_depends_on ON task_dependencies(depends_on_task_id);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comment_task ON comments(task_id);
CREATE INDEX idx_comment_user ON comments(user_id);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_task ON activities(task_id);
CREATE INDEX idx_activity_project ON activities(project_id);
CREATE INDEX idx_activity_created ON activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE
  USING (id IN (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for users
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for projects
CREATE POLICY "Users can view org projects"
  ON projects FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Members can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND org_id = projects.org_id 
      AND role IN ('admin', 'member')
    )
  );

-- RLS Policies for tasks
CREATE POLICY "Users can view org tasks"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Members can manage tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND org_id IN (
        SELECT org_id FROM projects WHERE id = tasks.project_id
      )
      AND role IN ('admin', 'member')
    )
  );

-- RLS Policies for task_dependencies
CREATE POLICY "Users can view task dependencies"
  ON task_dependencies FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Members can manage task dependencies"
  ON task_dependencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND org_id IN (
        SELECT org_id FROM projects 
        WHERE id IN (SELECT project_id FROM tasks WHERE id = task_dependencies.task_id)
      )
      AND role IN ('admin', 'member')
    )
  );

-- RLS Policies for comments
CREATE POLICY "Users can view task comments"
  ON comments FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Members can manage comments"
  ON comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND org_id IN (
        SELECT org_id FROM projects 
        WHERE id IN (SELECT project_id FROM tasks WHERE id = comments.task_id)
      )
      AND role IN ('admin', 'member')
    )
  );

-- RLS Policies for activities
CREATE POLICY "Users can view org activities"
  ON activities FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
    )
    OR
    task_id IN (
      SELECT id FROM tasks
      WHERE project_id IN (
        SELECT id FROM projects 
        WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())
      )
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
