import React, { useState } from 'react';
import { ValidarProvider } from './context/ValidarContext';
import TablaPolizas from './components/TablaPolizas';
import FormularioPoliza from './components/FormularioPoliza';
import PanelEstadisticas from './components/PanelEstadisticas';


import './App.css';


function App() {
  const [vista, setVista] = useState('tabla');
  
  // Estado para pasar una póliza al formulario cuando queremos editar
  const [polizaParaEditar, setPolizaParaEditar] = useState(null);

  // Función para capturar la póliza a editar y cambiar de vista
  const gestionarEdicion = (poliza) => {
    setPolizaParaEditar(poliza);
    setVista('formulario');
  };

  // Función para volver a la tabla y limpiar el modo edición
  const finalizarAccion = () => {
    setPolizaParaEditar(null);
    setVista('tabla');
  };

  return (
    <ValidarProvider>
      <div className="container">
        <header className="main-header">
          <h1>Seguimiento de Pólizas</h1>
          <nav className="nav-menu">
            <button 
              className={vista === 'tabla' ? 'active' : ''} 
              onClick={finalizarAccion}
            >
              Consultar Pólizas
            </button>
            <button 
              className={vista === 'formulario' && !polizaParaEditar ? 'active' : ''} 
              onClick={() => { setPolizaParaEditar(null); setVista('formulario'); }}
            >
              Alta Manual
            </button>
            <button 
              className={vista === 'stats' ? 'active' : ''} 
              onClick={() => setVista('stats')}
            >
              Estadísticas
            </button>
          </nav>
        </header>

        <main className="content">
          {vista === 'tabla' && (
            <section>
              <h2>Listado de Pólizas Activas</h2>
              <TablaPolizas onEditar={gestionarEdicion} />
            </section>
          )}

          {vista === 'formulario' && (
            <section>
              <h2>{polizaParaEditar ? 'Actualizar Póliza' : 'Registro de Nueva Póliza'}</h2>
              <FormularioPoliza 
                polizaEditable={polizaParaEditar} 
                alFinalizar={finalizarAccion} 
              />
            </section>
          )}

          {vista === 'stats' && (
            <section>
              <h2>Análisis de Datos</h2>
              <PanelEstadisticas />
            </section>
          )}
        </main>

        <footer className="footer">
          <p>© 2026 Marcos Rico Rodriguez - Actividad 2ª Evaluación</p>
        </footer>
      </div>
    </ValidarProvider>
  );
}

export default App;