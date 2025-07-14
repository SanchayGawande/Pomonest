'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, CheckCircle, Circle, Clock, Flame, Target, Trash2, Edit3 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Task {
  id: string
  title: string
  description?: string
  estimatedPomodoros: number
  completedPomodoros: number
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt: string
  completedAt?: string
}

interface TaskManagerProps {
  onTaskSelect?: (task: Task) => void
  onSessionComplete?: (taskId: string) => void
  currentTask?: Task | null
}

const TASK_STORAGE_KEY = 'workstreak_tasks'
const TASK_CATEGORIES = [
  'Work',
  'Study', 
  'Personal',
  'Health',
  'Creative',
  'Learning',
  'Other'
]

export function TaskManager({ onTaskSelect, onSessionComplete, currentTask }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState<{
    title: string
    description: string
    estimatedPomodoros: number
    priority: 'low' | 'medium' | 'high'
    category: string
  }>({
    title: '',
    description: '',
    estimatedPomodoros: 1,
    priority: 'medium',
    category: 'Work'
  })
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASK_STORAGE_KEY)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      estimatedPomodoros: newTask.estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      createdAt: new Date().toISOString()
    }

    setTasks(prev => [task, ...prev])
    setNewTask({
      title: '',
      description: '',
      estimatedPomodoros: 1,
      priority: 'medium',
      category: 'Work'
    })
    setShowAddTask(false)
  }

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ))
  }

  const updateTaskProgress = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completedPomodoros: Math.min(task.completedPomodoros + 1, task.estimatedPomodoros),
            completed: task.completedPomodoros + 1 >= task.estimatedPomodoros
          }
        : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  // Handle session completion
  useEffect(() => {
    if (currentTask && onSessionComplete) {
      updateTaskProgress(currentTask.id)
    }
  }, [onSessionComplete])

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed
      case 'completed':
        return task.completed
      default:
        return true
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴'
      case 'medium':
        return '🟡'
      case 'low':
        return '🟢'
      default:
        return '⚪'
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Task Manager Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tasks & Goals
              </CardTitle>
              <CardDescription>
                Break down your work into focused sessions
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddTask(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{completedTasks}/{totalTasks} tasks completed</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalTasks}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{totalTasks - completedTasks}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter(t => !t.completed).length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.completed).length})
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-3">
              <Target className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-medium">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === 'completed' 
                    ? 'Complete some tasks to see them here' 
                    : 'Add your first task to get started'
                  }
                </p>
              </div>
              {filter !== 'completed' && (
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <Card 
              key={task.id} 
              className={`transition-all duration-300 hover:shadow-md ${
                currentTask?.id === task.id ? 'ring-2 ring-primary' : ''
              } ${task.completed ? 'opacity-75' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Task Checkbox */}
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskComplete(task.id)}
                    className="mt-1"
                  />

                  {/* Task Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getPriorityIcon(task.priority)} {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.completedPomodoros}/{task.estimatedPomodoros} sessions
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((task.completedPomodoros / task.estimatedPomodoros) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(task.completedPomodoros / task.estimatedPomodoros) * 100} 
                        className="h-1"
                      />
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {!task.completed && (
                          <Button
                            size="sm"
                            variant={currentTask?.id === task.id ? "default" : "outline"}
                            onClick={() => onTaskSelect?.(task)}
                          >
                            {currentTask?.id === task.id ? (
                              <>
                                <Flame className="h-3 w-3 mr-1" />
                                Working on this
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Focus on this
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to track with Pomodoro sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input
                placeholder="What do you want to work on?"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                placeholder="Add more details..."
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewTask(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Estimated Sessions ({newTask.estimatedPomodoros} × 25 min = {newTask.estimatedPomodoros * 25} min)
              </label>
              <Select 
                value={newTask.estimatedPomodoros.toString()} 
                onValueChange={(value) => setNewTask(prev => ({ ...prev, estimatedPomodoros: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} session{num > 1 ? 's' : ''} ({num * 25} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddTask(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addTask} disabled={!newTask.title.trim()} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}