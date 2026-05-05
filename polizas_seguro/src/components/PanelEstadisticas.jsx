import React, { useState, useEffect } from 'react';

const PanelEstadisticas = () => {
  const [stats, setStats] = useState(null);
  const [filtros, setFiltros] = useState({ transmision: '', comb_electrico: '', siniestro: '' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtros.transmision) params.append('transmision', filtros.transmision);
    if (filtros.comb_electrico) params.append('comb_electrico', filtros.comb_electrico);
    if (filtros.siniestro !== '') params.append('siniestro', filtros.siniestro);

    fetch(`http://localhost:5230/api/stats?${params.toString()}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error al pedir stats:", err));
  }, [filtros]);

  return (
    <div className="stats-container">
      {/* Sección de Filtros Estilizada */}
      <div className="filtros" style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <select 
          className="select-custom"
          onChange={e => setFiltros({...filtros, transmision: e.target.value})}
        >
          <option value="">Todas las transmisiones</option>
          <option value="Manual">Manual</option>
          <option value="Automática">Automática</option>
        </select>

        <select 
          className="select-custom"
          onChange={e => setFiltros({...filtros, siniestro: e.target.value})}
        >
          <option value=""> Siniestros: Todos</option>
          <option value="1">Con Siniestro</option>
          <option value="0">Sin Siniestro</option>
        </select>
      </div>

      {stats && stats.totalPolizas > 0 ? (
        <div className="cards">
          
          <div className="card">
            <h4>Total Pólizas</h4>
            <p>{stats.totalPolizas}</p>
          </div>

          <div className="card">
            <h4>Siniestralidad</h4>
            {/* Si el porcentaje es alto, lo ponemos en rojo directamente */}
            <p style={{ color: stats.porcentajeSiniestro > 15 ? 'var(--danger)' : 'var(--success)' }}>
                {stats.porcentajeSiniestro}%
            </p>
          </div>

          <div className="card">
            <h4>Media Edad Vehículo</h4>
            <p>{stats.mediaEdadCoche} <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>años</span></p>
          </div>

          <div className="card">
            <h4>Media Edad Tomador</h4>
            <p>{stats.mediaEdadTomador} <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>años</span></p>
          </div>

        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No se encontraron pólizas con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default PanelEstadisticas;