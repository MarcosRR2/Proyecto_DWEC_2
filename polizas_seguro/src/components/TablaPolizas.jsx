import React, { useEffect, useState } from 'react';

const TablaPolizas = ({ onEditar }) => {
  const [polizas, setPolizas] = useState([]);

  // Función para obtener los datos del servidor
  const cargar = () => {
    fetch('http://localhost:5230/api/polizas')
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener pólizas");
        return res.json();
      })
      .then(data => setPolizas(data))
      .catch(err => console.error("Error en el GET:", err));
  };

  // Cargar datos al montar el componente
  useEffect(() => { 
    cargar(); 
  }, []);

  // Función para borrar (Borrado lógico)
  const eliminar = (id) => {
    if (window.confirm(`¿Seguro que quieres eliminar la póliza ${id}?`)) {
      // Forzamos el método DELETE y manejamos la respuesta
      fetch(`http://localhost:5230/api/polizas/delete/${id}`, { 
        method: 'DELETE' 
      })
      .then(res => {
        if (res.ok) {
          console.log("Eliminado con éxito");
          cargar(); // Volver a pedir los datos tras borrar
        } else {
          alert("No se pudo eliminar la póliza del servidor");
        }
      })
      .catch(err => console.error("Error en el DELETE:", err));
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Matrícula</th>
            <th>Vigencia</th>
            <th>Cilindrada</th>
            <th>Cilindros</th>
            <th>Peso</th>
            <th>Transmision</th>
            <th>Tipo Motor</th>
            <th>Siniestro</th>
            <th>Edad Coche</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {polizas.length > 0 ? (
            polizas.map(p => (
              <tr key={p.id_poliza}>
                <td>{p.id_poliza}</td>
                <td>{p.matricula}</td>
                <td>{p.vigencia} meses</td>
                <td>{p.cilindrada}</td>    
                <td>{p.cilindros}</td>
                <td>{p.peso}</td>
                <td>{p.transmision}</td>
                <td>{p.comb_electrico}</td>
                <td>{p.siniestro === 1 ? "Sí" : "No"}</td>
                <td>{p.edad_coche} años</td>
                <td>
                  <button className="btn-edit" onClick={() => onEditar(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => eliminar(p.id_poliza)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay pólizas activas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPolizas;