'use strings'

var expect = require("chai").expect;
const { json } = require("express");
var asistencias = require("../src/modulos/conexion");
var lectura = require("../src/modulos/lecturaArchivos")


describe("Registro de Asistencias - Test", function() {

    describe("Pruebas de funciones", function() {
        
        it("Test de Crear Curso", function(){
            expect(asistencias.crearCurso("Arquitectura"));
        })

        it("Test de Crear Grupo", function(){
            expect(asistencias.crearGrupo("Grupo4", "Arquitectura"));
        });

        it("Test de Modificar Curso", function(){
            expect(asistencias.modificarCurso("Arquitectura","Comunicacion"));
        });
        
        var lista = [curso = "Arquitectura", grupo = asistencias.obtenerGrupo("Grupo 4")]

        it("Test de Subir archivo", function(){
            var ejem = {
                "curso": "Agiles2",
                "grupo": {
                  "alumnos": [],
                  "_id": "5fcecbe0b2d2b118cc984127",
                  "nombre": "curso 1",
                  "curso": "5fcecbbbb2d2b118cc984126",
                  "__v": 0
                },
                "unidad": 1,
                "fecha": "2020-08-25",
                "asistencias": [
                  "jesus daniel aldeco valenzuela",
                  "julio contreras",
                  "jose eduardo montoya solis",
                  "miguel angel zamorano beltran",
                  "ana sofia salgado montoya",
                  "jose roberto rey baldenegro",
                  "miguel angel mancillas castañeda",
                  "pablo beltran daniel",
                  "alejandro galindo covarrubias",
                  "jose francisco felix romero",
                  "roberto jose escalante valdez",
                  "luis enrique mendoza higuera",
                  "alexis issac sagasta ontiveros",
                  "guillermo eduardo ochoa parra",
                  "javier armando méndez pérez",
                  "DAHIR RUBEN VALENZUELA VALENZUELA"
                ]
              }
            expect(asistencias.registrarAsistencia(ejem, err =>{

            }));
        });
            
        it("Test de Eliminar Curso", function(){
            expect(asistencias.eliminarCurso("Comunicacion"));
        });

        it("Test de obtener asistencia", function(){
            expect(asistencias.obtenerAsistenciasCallback());
        });
    });
    
});