import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5230;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, 'data', 'seguros.json');

app.use(cors());
app.use(express.json());

// Función auxiliar para leer/escribir 
const leerDatos = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const guardarDatos = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// 1. GET /api/polizas - Listado completo 
app.get('/api/polizas', (req, res) => {
    try {
        const data = leerDatos();

        // Filtramos por el campo 'activo' para el borrado lógico
        const activas = data.filter(p => p.activo !== false);
        res.json(activas);
    } catch (error) {
        res.status(500).json({ message: "Error al leer datos" });
    }
});

// 2. GET /api/polizas/:id - Detalle de una póliza
app.get('/api/polizas/:id', (req, res) => {
    const data = leerDatos();
    const poliza = data.find(p => p.id_poliza === req.params.id);
    
    if (poliza && poliza.activo !== false) {
        res.json(poliza);
    } else {
        res.status(404).json({ message: "Póliza no encontrada" });
    }
});

// 3. POST /api/polizas - Alta manual
app.post('/api/polizas', (req, res) => {
    try {
        const data = leerDatos();
        const nueva = { ...req.body, activo: true }; // Forzamos activo: true
        
        // Verificamos si el ID ya existe para no duplicar
        if (data.find(p => p.id_poliza === nueva.id_poliza)) {
            return res.status(400).json({ message: "El ID de póliza ya existe" });
        }

        data.push(nueva);
        guardarDatos(data);
        res.status(201).json({ message: "Póliza creada con éxito", poliza: nueva });
    } catch (error) {
        res.status(500).json({ message: "Error al guardar" });
    }
});

// 4. PUT /api/polizas - Actualización
app.put('/api/polizas', (req, res) => {
    const data = leerDatos();
    const editada = req.body;

    const index = data.findIndex(p => p.id_poliza === editada.id_poliza);

    if (index !== -1) {
        
        // Mantenemos matricula e id_poliza originales por seguridad del servidor
        data[index] = { 
            ...data[index], 
            ...editada,
            id_poliza: data[index].id_poliza, // Protegemos campo
            matricula: data[index].matricula, // Protegemos campo
            activo: true 
        };
        
        guardarDatos(data);
        res.json({ message: "Póliza actualizada con éxito" });
    } else {
        res.status(404).json({ message: "No se encontró la póliza" });
    }
});

app.delete('/api/polizas/delete/:id', (req, res) => {
    const data = leerDatos();
    const index = data.findIndex(p => p.id_poliza === req.params.id);

    if (index !== -1) {
        data[index].activo = false; 
        guardarDatos(data);
        res.json({ message: "Póliza eliminada correctamente" });
    } else {
        res.status(404).json({ message: "ID no encontrado" });
    }
});

// 6. GET /api/stats - Estadísticas (Cálculos en Backend)
app.get('/api/stats', (req, res) => {
    const data = leerDatos();
    const { transmision, comb_electrico, siniestro } = req.query;

    let filtrados = data.filter(p => p.activo !== false);

    if (transmision) filtrados = filtrados.filter(p => p.transmision === transmision);
    if (comb_electrico) filtrados = filtrados.filter(p => p.comb_electrico === comb_electrico);
    if (siniestro !== undefined) filtrados = filtrados.filter(p => p.siniestro === parseInt(siniestro));

    if (filtrados.length === 0) return res.json({ total: 0 });

    const total = filtrados.length;
    const conSiniestro = filtrados.filter(p => parseInt(p.siniestro) === 1).length;
    const sumaEdadCoche = filtrados.reduce((acc, p) => acc + Number(p.edad_coche), 0);
    const sumaEdadTomador = filtrados.reduce((acc, p) => acc + Number(p.edad_tomador), 0);

    res.json({
        totalPolizas: total,
        porcentajeSiniestro: ((conSiniestro / total) * 100).toFixed(2),
        porcentajeSinSiniestro: (((total - conSiniestro) / total) * 100).toFixed(2),
        mediaEdadCoche: (sumaEdadCoche / total).toFixed(2),
        mediaEdadTomador: (sumaEdadTomador / total).toFixed(2)
    });
});

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));