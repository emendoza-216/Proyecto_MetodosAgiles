__Travis-ci__: [![Travis](https://img.shields.io/travis/emendoza-216/emendoza-216_Proyecto_MetodosAgiles.svg)]()

__Sonarcloud__: [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=emendoza-216_Proyecto_MetodosAgiles&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=emendoza-216_Proyecto_MetodosAgiles)[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=emendoza-216_Proyecto_MetodosAgiles&metric=security_rating)](https://sonarcloud.io/dashboard?id=emendoza-216_Proyecto_MetodosAgiles)[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=emendoza-216_Proyecto_MetodosAgiles&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=emendoza-216_Proyecto_MetodosAgiles)[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=emendoza-216_Proyecto_MetodosAgiles&metric=ncloc)](https://sonarcloud.io/dashboard?id=emendoza-216_Proyecto_MetodosAgiles)[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=emendoza-216_Proyecto_MetodosAgiles&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=emendoza-216_Proyecto_MetodosAgiles)

# Proyecto_MetodosAgiles
Proyecto de la clase de Métodos Ágiles de Desarrollo

# Manejador de asistencias para clases en línea

# Planteamiento del problema
Ahora con la emergencia sanitaria la educación en línea tomó una alta relevancia; todos los
maestros en el mundo tuvieron que hacer uso de los recursos existentes para sobrellevar las clases
a distancia. Uno de los problemas que vinieron encima fue el pase de asistencia de los alumnos, que
normalmente toma mucho tiempo en modo presencial, ahora en modalidad toma un tiempo similar
o mayor dado que hay alumnos que no tienen en buenas condiciones sus micrófonos para decir
“presente”, o no tienen buena conexión, etc. Algunos maestros han optado por grabar las sesiones
y posteriormente revisar los videos para ver quien realmente estuvo en línea. Algunos otros más
aventajados, usan extensiones de Google Chrome que en conjunto con Google Meet registran en
un archivo la asistencia de la sesión de manera automática. Este último caso, pareciera el ideal, sin
embargo, por cada sesión se genera un archivo (ejemplo adjunto a este documento) lo que provoca
que no se tenga un solo concentrado de las asistencias a las sesiones sincrónicas. Por otro lado,
cuando un maestro tiene varios cursos, se puede complicar la administración de los registros de
asistencia, dado que sería un archivo por cada sesión de cada curso.

# Planteamiento del sistema
Por lo anterior, se requiere un sistema que permita el manejo de asistencias a clases en línea, de tal
manera que el archivo generado por extensiones de Google Chrome pueda ser subido a una
plataforma para que se registren las asistencias de cada alumno, por fecha, por unidad/sección del
curso, y obviamente por curso y grupo. Se debe contemplar que cada maestro pueda registrar los
cursos que está impartiendo y las unidades/secciones de cada uno de ellos. También, se debe
contemplar un visualizador de asistencias por grupo, curso, unidad, y hasta por alumno
(independientemente del curso o grupo al cual esté inscrito). El resto de los detalles se irán
obteniendo en el transcurso del proyecto.