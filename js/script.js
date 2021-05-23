const indexedDb = window.indexedDB;

let db

const conexion = indexedDb.open('listaTareas',2)

conexion.onsuccess = () =>{
    db = conexion.result
    console.log('Base de datos abierta', db)
}

conexion.onupgradeneeded = (e) =>{
    db = e.target.result
    console.log('Base de datos creada', db)
    const coleccionObjetos = db.createObjectStore('tareas',{
        keyPath: 'clave'
    })
}

conexion.onerror = (error) =>{
    console.log('Error ', error)
}

const agregar = (info) => {
    const trasaccion = db.transaction(['tareas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.add(data)
    consultar()
}

const obtener = (clave) =>{
    const trasaccion = db.transaction(['tareas'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = (e) =>{
        console.log(conexion.result)
    }
    
}

const actualizar = (data) =>{    
    const trasaccion = db.transaction(['tareas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.put(data)
    
    conexion.onsuccess = () =>{
        consultar()
    }
}

const eliminar = (clave) =>{      
    const trasaccion = db.transaction(['tareas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

const consultar = () =>{
    const trasaccion = db.transaction(['tareas'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('tareas')
    const conexion = coleccionObjetos.openCursor()

    console.log('Lista de tareas')
    
    conexion.onsuccess = (e) =>{
        const cursor = e.target.result        
        if(cursor){
            console.log(cursor.value)
            cursor.continue()
        }else{
            console.log('No hay tareas en la lista')
        }
    }
}