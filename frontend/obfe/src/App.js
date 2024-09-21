import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// custom imports
import Home from './Home.js';
import DocumentDashboard from './Dashboard.js';
import TableView from './TableView.js';
import { defaultQueryFn, defaultMutationFn } from './utils.js'


const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: { queryFn: defaultQueryFn },
      mutations: { mutationFn: defaultMutationFn }
    }
  }

)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/table/:tableid' element={<TableView />} />
          <Route path='/dashboard' element={<DocumentDashboard />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}


export default App;
