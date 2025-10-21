import React from 'react'
import { format } from 'date-fns'
import { BiCalendar, BiEdit } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import { cva } from 'class-variance-authority'

const statusStyles = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        todo: "bg-gray-100 text-gray-800",
        inProgress: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
      },
    },
    defaultVariants: {
      status: "todo",
    },
  }
)

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusMap = {
    'todo': 'To Do',
    'inProgress': 'In Progress',
    'completed': 'Completed'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <BiEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
          >
            <AiOutlineDelete className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BiCalendar className="w-4 h-4" />
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        </div>
        <span className={statusStyles({ status: task.status })}>
          {statusMap[task.status]}
        </span>
      </div>
    </div>
  )
}

export default TaskCard