const indexedDB = window.indexedDB

let db
const conexion = indexedDB.open('listaTareas', 1)

conexion.onsuccess = () => {
    db = conexion.result
    console.log('Base de datos abierta', db)
    readData()
}

conexion.onupgradeneeded = (e) => {
    db = e.target.result
    console.log('Base de datos creada', db)
    const objectStore = db.createObjectStore('tareas', {
        keyPath: 'clave'
    })
}

conexion.onerror = (error) => {
    console.log('Error', error)
}

const addData = (data) => {
    const transaction = db.transaction(['tareas'], 'readwrite')
    const objectStore = transaction.objectStore('tareas')
    const conexion = objectStore.add(data)
    readData()
}

const getData = (key) => {
    const transaction = db.transaction(['tareas'], 'readwrite')
    const objectStore = transaction.objectStore('tareas')
    const conexion = objectStore.get(key)

    conexion.onsuccess = (e) => {
        console.log(conexion.result);
    }
}

const updateData = (data) => {
    const transaction = db.transaction(['tareas'], 'readwrite')
    const objectStore = transaction.objectStore('tareas')
    const conexion = objectStore.put(data)
    conexion.onsuccess = () => {
        readData()
    }
}

const deleteData = (key) => {
    const transaction = db.transaction(['tareas'], 'readwrite')
    const objectStore = transaction.objectStore('tareas')
    const conexion = objectStore.delete(key)
    conexion.onsuccess = () => {
        readData()
    }
}

const readData = () => {
    const transaction = db.transaction(['tareas'], 'readonly')
    const objectStore = transaction.objectStore('tareas')
    const conexion = objectStore.openCursor()

    conexion.onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
            console.log('Lista de tareas');
            console.log(cursor.value);
        }else{
            console.log('No hay tareas en la lista');
        }
    }
}