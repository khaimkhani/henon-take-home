import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

// custom imports
import Home from './Home.js';
import DocumentDashboard from './Dashboard.js';
import TableView from './TableView.js';


const defaultQueryFn = async ({ queryKey }) => {

  const res = await fetch(`http://localhost:8000/api/${queryKey[0]}`)

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()
}

const defaultMutationFn = async ({ endpoint, data }) => {

  const res = await fetch(`http://localhost:8000/api/${endpoint}`, {
    method: 'POST', headers: {
      'Content-Type': 'application/json'
    }, body: data
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()

}

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: { queryFn: defaultQueryFn },
      mutations: { mutationFn: defaultMutationFn }
    }
  }

)

function App() {
  // hit initial endpoints
  // get user etc
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/table' element={<TableView />} />
          <Route path='/dashboard' element={<DocumentDashboard />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}


export default App;
