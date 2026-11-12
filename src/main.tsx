import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { AuthProvider,useAuth } from './contexto/Auth';
import { Layout } from './componentes/Layout';
import Inicio from './paginas/Inicio';
import Buscar from './paginas/Buscar';
import Coleccion from './paginas/Coleccion';
import Detalle from './paginas/Detalle';
import Noche from './paginas/Noche';
import Entrar from './paginas/Entrar';
function Protegida(){const {user,pending}=useAuth();if(pending)return <div className="loading-page" role="status">Preparando tu cartelera...</div>;return user?<Layout/>:<Navigate to="/entrar" replace/>;}
function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/entrar" element={<Entrar/>}/><Route element={<Protegida/>}><Route path="/" element={<Inicio/>}/><Route path="/buscar" element={<Buscar/>}/><Route path="/coleccion" element={<Coleccion/>}/><Route path="/titulo/:tipo/:id" element={<Detalle/>}/><Route path="/noche" element={<Noche/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter></AuthProvider>;}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
