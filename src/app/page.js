"use client";

import React, { useState } from "react";
import axios from "axios";

import Select from "./components/select";
import { setRequestMeta } from "next/dist/server/request-meta";

export default function Home() {
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    tipoRamo: 0,
    ramo: 0,
    producto: 0,
    tasa: 0,
    sumaAsegurada: 0
  });

  const [result, setResult] = useState(null);

  const baseUrl = "https://localhost:7049/api/";

  const handleChangeCedula = (e) => setForm({ ...form, cedula: e.target.value });
  const handleChangeNombre = (e) => setForm({ ...form, nombre: e.target.value });
  const handleChangeSumaAsegurada = (e) => setForm({ ...form, sumaAsegurada: e.target.value });

  const handleChangeTipoRamo = (selectedValue) => setForm({ ...form, tipoRamo: selectedValue }); 
  const handleChangeRamo = (selectedValue) => setForm({ ...form, ramo: selectedValue }); 
  const handleChangeProducto = (selectedValue) => setForm({ ...form, producto: selectedValue }); 
  const handleChangeTasa = (selectedValue) => setForm({ ...form, tasa: selectedValue }); 

  const calculate = async () => {
    if (form.sumaAsegurada === 0 || form.tasa === 0) {
      alert('Complete el formulario');
      return;    
    }

    const { data } = await axios.get(`${baseUrl}Prima/calculate?sumaAsegurada=${form.sumaAsegurada}&tasaId=${form.tasa}`);
    
    setResult(parseFloat(data).toFixed(2));
  }

  return (
    <div className="container-sm">
      <h1>Calcular prima</h1>
      <form action={calculate}>
        <h3>Datos del cliente</h3>
        <div className="row col-4">
          <label className="col-form-label" htmlFor="cedula">Cedula</label>
          <input 
            className="form-control" 
            id="cedula" 
            value={form.cedula} 
            onChange={handleChangeCedula}   
          />
        </div>
        <div className="row col-4">
          <label className="col-form-label" htmlFor="nombre">Nombre</label>
          <input 
            className="form-control" 
            id="nombre" 
            value={form.nombre} 
            onChange={handleChangeNombre} />
        </div>

        <hr />

        <h3>Producto</h3>
        <div className="row">
          <Select
            label="Tipo de ramo"
            name="tipo-ramo"
            url={`${baseUrl}TipoRamo/loadSelect`}
            onSelectChange={handleChangeTipoRamo}
          ></Select>
        </div>

        <div className="row">
          <Select
            label="Ramo"
            name="tipo-ramo"
            url={`${baseUrl}Ramo/loadSelect?tipoRamoId=${form.tipoRamo}`}
            dependence={form.tipoRamo}
            onSelectChange={handleChangeRamo}
          ></Select>
        </div>

        <div className="row">
          <Select
            label="Producto"
            name="producto"
            url={`${baseUrl}Producto/loadSelect`}
            onSelectChange={handleChangeProducto}
          ></Select>
        </div>

        <div className="row">
          <Select
            label="Tasa"
            name="tasa"
            url={`${baseUrl}Tasa/loadSelect?productoId=${form.producto}`}
            dependence={form.producto}
            onSelectChange={handleChangeTasa}
          ></Select>       
        </div>

        <hr />

        <h3>Suma asegurada</h3>
        <div className="row col-4">
          <label className="col-form-label" htmlFor="suma-asegurada">Suma</label>
          <input 
            className="form-control" 
            id="suma-asegurada" 
            value={form.sumaAsegurada} 
            onChange={handleChangeSumaAsegurada}  
          />
        </div>

        
        <div className="container mt-4">
          <button type="submit" class="btn btn-success mt-3">Calcular</button>

          {result !== null && (
            <div className="alert alert-info mt-3">
              <h4 className="alert-heading">La prima es: </h4>
              <p>{result}</p>
            </div>
          )}
    </div>

      </form>
    </div>
  );
}
