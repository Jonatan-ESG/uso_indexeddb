// Alamacenar el api en una variable
const indexedDb = window.indexedDB;

//Crear la variable que almacenará la instancia de la base de datos
let db

//Crear la conexión a la base de datos e indicar la versión
const conexion = indexedDb.open('listaTareas',2)

//Evento que se dispara cuando la base de datos se abré
conexion.onsuccess = () =>{
    db = conexion.result
    console.log('Base de datos abierta', db)
}

//Evento que se dispara cuando la base de datos se crea o se actualiza
conexion.onupgradeneeded = (e) =>{
    db = e.target.result
    console.log('Base de datos creada', db)
    const coleccionObjetos = db.createObjectStore('tareas',{
        keyPath: 'clave' /* Nombre del campo, dentro del registro, qué será la identificación única */
    })
}

//Evento que se dispara cuando la base de datos no se puede abrir
conexion.onerror = (error) =>{
    console.log('Error ', error)
}

/*
    Funciones para manejar la base de datos indexedDB
*/

//Función que permite agregar un registro a la colección, enviándole un objeto con el fomato { clave : int, ... }
const agregar = (info) => {
    //Definir el tipo de transaccion y sobre que colección se realizará
    const trasaccion = db.transaction(['tareas'],'readwrite')
    //Obtener la colección de la transacción
    const coleccionObjetos = trasaccion.objectStore('tareas')
    //Ejecutar el método deseado sobre la colección obtenida
    const conexion = coleccionObjetos.add(data)
    //Llamada a la función que lee toda la colección
    consultar()
}

//Función que permite obtener un registro, enviándele la clave del registro
const obtener = (clave) =>{
    const trasaccion = db.transaction(['tareas'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = (e) =>{
        console.log(conexion.result)
    }
    
}

//Función que permite actulizar un registro de la colección, enviándole un objeto con el fomato { clave : clave_registro int, ... }
const actualizar = (data) =>{    
    const trasaccion = db.transaction(['tareas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.put(data)
    
    conexion.onsuccess = () =>{
        consultar()
    }
}

//Función que permite eliminar un registro a la colección, enviándele la clave del registro
const eliminar = (clave) =>{      
    const trasaccion = db.transaction(['tareas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

//Función que permite obtener todos los registros de la colección
const consultar = () =>{
    const trasaccion = db.transaction(['tareas'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.openCursor()

    console.log('Lista de tareas')
    
    //Escuchar el evento onsuccess del método openCursor()
    conexion.onsuccess = (e) =>{
        //Obtener el cursor de la colección
        const cursor = e.target.result
        //Si el cursor es falso imprimir mensaje de lista vacía o recorrido terminado
        if(cursor){
            //Mostrar por consola el valor del cursor (registro en esa posición del cursor)
            console.log(cursor.value)
            //Avanzar detro del cursor
            cursor.continue()
        }else{
            console.log('No hay tareas en la lista')
        }
    }
}

/*
    Formato general de transacciones:

    const trasaccion = instancia_bd.transaction([nombre_coleccion],tipo_transaccion)
        tipo_transaccion utilizado acá
            readwrite = Leer y escribir
            readolny = Consultar o leer

    const coleccionObjetos = trasaccion.objectStore(nombre_coleccion)
        
    const conexion = coleccionObjetos.método_transaccion(parámetros)
        método_transaccion utilizado acá
            add = Agregar registro a la colección
                registro (OBJETO) que se agregará a la colección
            get = Obtener un registro de la colección
                Llave de identificación del registro 
            put = Actualizar un registro de la colección
                registro (OBJETO) que se agregará a la colección, que contenga la llave de identificación del registro (si la llave es distinta se crea un nuevo registro)
            delete = Eliminar un registro de la colección
                Llave de identificación del registro 
            openCursor = Abrir un cursor que recorre la colección | Sin parámetros
                Método que lanza el evento onsuccess dentro del que está disponible el cursor de la coleción
*/