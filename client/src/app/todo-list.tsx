import { useEffect, useState } from 'react';
import { ApiResponse, Todo } from '@superseed/shared';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/todos');
        const data: ApiResponse<Todo[]> = await response.json();
        
        if (data.success && data.data) {
          setTodos(data.data);
        } else {
          setError(data.error || 'Failed to fetch todos');
        }
      } catch (err) {
        setError('Error connecting to API');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>
      
      <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
        {todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No todos found</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={todo.completed}
                  readOnly
                />
                <span 
                  className={`ml-3 ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 