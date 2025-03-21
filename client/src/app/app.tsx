// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Route, Routes } from 'react-router-dom';
import TodoList from './todo-list';
import './app.module.css';

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Superseed Project</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<TodoList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
