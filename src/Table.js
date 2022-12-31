import React from 'react'
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import {mockDataContacts} from './components/Data'
function Table() {
    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: 'Name' },
        { key: 'email', name: 'Email' },
        { key: 'age', name: 'Age' },
        { key: 'phone', name: 'Phone' },
        { key: 'address', name: 'Address' },
        { key: 'city', name: 'City' },
        { key: 'zipCode', name: 'ZipCode' },
        { key: 'registrarId', name: 'RegistrarId' },
      ];

      function rowKeyGetter() {
        return mockDataContacts.id;
      }

  return (
    <div className='bg-red-500 h-screen w-full'>
<DataGrid columns={columns} rows={mockDataContacts} rowKeyGetter={rowKeyGetter}  className='bg-red-500 w-8/12 mx-auto pt-4'/>
    </div>
    
  )
}

export default Table