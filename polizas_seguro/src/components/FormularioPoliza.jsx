import React, { useState, useContext, useEffect } from 'react';
import { ValidarContext } from '../context/ValidarContext';

const FormularioPoliza = ({ polizaEditable, alFinalizar }) => {
  const { id_poliza: regexID, matricula: regexMat } = useContext(ValidarContext);
  
  const [form, setForm] = useState({
    id_poliza: '', 
    matricula: '', 
    vigencia: 1, 
    edad_coche: 0, 
    edad_tomador: 18, 
    cilindrada: 1000, 
    cilindros: 4, 
    transmision: 'Manual', 
    comb_electrico: 'Combustión', 
    peso: 1000, 
    siniestro: 0
  });

  useEffect(() => {
    if (polizaEditable) setForm(polizaEditable);
  }, [polizaEditable]);

  const guardar = (e) => {
    e.preventDefault();

    // Validaciones técnicas según enunciado
    if (!regexID.test(form.id_poliza)) return alert("ID debe ser IDXXXXX (5 números)");
    if (!regexMat.test(form.matricula)) return alert("Matrícula española incorrecta (Ej: 1234BBB)");
    if (form.vigencia < 1 || form.vigencia > 21) return alert("Vigencia entre 1 y 21 meses");
    if (form.edad_coche < 0 || form.edad_coche > 10) return alert("Edad coche entre 0 y 10 años");
    if (form.edad_tomador < 18 || form.edad_tomador > 90) return alert("Edad tomador entre 18 y 90 años");

    const metodo = polizaEditable ? 'PUT' : 'POST';

    fetch('http://localhost:5230/api/polizas', {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
    })
    .then(() => {
        alert(polizaEditable ? "Póliza actualizada" : "Póliza creada");
        alFinalizar();
    })
    .catch(err => alert(err.message));
  };

  return (
    <form className="form-seguros" onSubmit={guardar}>

      <div className="form-row">
        <div className="form-group">
          <label>ID Póliza:</label>
          <input type="text" placeholder="ID12345" disabled={!!polizaEditable} value={form.id_poliza} onChange={e => setForm({...form, id_poliza: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Matrícula:</label>
          <input type="text" placeholder="1234BBB" disabled={!!polizaEditable} value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} required />
        </div>
      </div>


      <div className="form-row">
        <div className="form-group">
          <label>Vigencia (meses):</label>
          <input type="number" value={form.vigencia} onChange={e => setForm({...form, vigencia: parseInt(e.target.value) || 0})} required />
        </div>
        <div className="form-group">
          <label>Antigüedad Coche (años):</label>
          <input type="number" value={form.edad_coche} onChange={e => setForm({...form, edad_coche: parseInt(e.target.value) || 0})} required />
        </div>
        <div className="form-group">
          <label>Edad Tomador:</label>
          <input type="number" value={form.edad_tomador} onChange={e => setForm({...form, edad_tomador: parseInt(e.target.value) || 0})} required />
        </div>
      </div>


      <div className="form-row">
        <div className="form-group">
          <label>Cilindrada (cc):</label>
          <input type="number" placeholder="Ej: 1200" value={form.cilindrada} onChange={e => setForm({...form, cilindrada: parseInt(e.target.value) || 0})} required />
        </div>
        <div className="form-group">
          <label>Número de Cilindros:</label>
          <input type="number" placeholder="Ej: 4" value={form.cilindros} onChange={e => setForm({...form, cilindros: parseInt(e.target.value) || 0})} required />
        </div>
        <div className="form-group">
          <label>Peso (kg):</label>
          <input type="number" placeholder="Ej: 1400" value={form.peso} onChange={e => setForm({...form, peso: parseInt(e.target.value) || 0})} required />
        </div>
      </div>


      <div className="form-row">
        <div className="form-group">
          <label>Tipo de Vehículo:</label>
          <select value={form.comb_electrico} onChange={e => setForm({...form, comb_electrico: e.target.value})}>
            <option value="Combustión">Combustión</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>
        </div>
        <div className="form-group">
          <label>Transmisión:</label>
          <select value={form.transmision} onChange={e => setForm({...form, transmision: e.target.value})}>
            <option value="Manual">Manual</option>
            <option value="Automática">Automática</option>
          </select>
        </div>
        <div className="form-group">
          <label>¿Siniestro?</label>
          <select value={form.siniestro} onChange={e => setForm({...form, siniestro: parseInt(e.target.value)})}>
            <option value={0}>No</option>
            <option value={1}>Sí</option>
          </select>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn-primary">
            {polizaEditable ? "Actualizar Póliza" : "Registrar Póliza"}
        </button>
        <button type="button" className="btn-secondary" onClick={alFinalizar}>
            Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioPoliza;