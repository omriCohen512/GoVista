
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout-area/layout/layout'
import './index.css'
import { interceptor } from './utils/interceptor'

// Initialize the Axios interceptor before rendering the application.
interceptor.create();

// Render the application with React Router enabled.
createRoot(document.getElementById('root')!).render(

    <BrowserRouter>

        <Layout />

    </BrowserRouter>

)
