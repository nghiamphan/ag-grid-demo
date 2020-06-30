import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const KEY = 'ag-grid-demo-saved-state'

const initialColumnDefs = [{
	headerName: "Make", field: "make", sortable: true
}, {
	headerName: "Model", field: "model", sortable: true
}, {
	headerName: "Price", field: "price", sortable: true
}]

const rowData = [{
	make: "Toyota", model: "Celica", price: 35000
}, {
	make: "Ford", model: "Mondeo", price: 32000
}, {
	make: "Porsche", model: "Boxter", price: 72000
}]

const App = () => {
	//window.localStorage.removeItem(KEY)
	const [savedState, setSavedState] = useState(JSON.parse(window.localStorage.getItem(KEY)))
	const [data, setData] = useState(rowData)

	const filter = input => {
		let filteredData = rowData
		if (input.make)
			filteredData = filteredData.filter(row => row.make.toLowerCase() === input.make.toLowerCase())
		if (input.model)
			filteredData = filteredData.filter(row => row.model.toLowerCase() === input.model.toLowerCase())
		if (input.minPrice)
			filteredData = filteredData.filter(row => row.price >= input.minPrice)
		if (input.maxPrice)
			filteredData = filteredData.filter(row => row.price < input.maxPrice)

		setData(filteredData)
	}

	useEffect(() => {
		if (savedState && savedState.input) {
			filter(savedState.input)
		}
	}, [savedState])

	const { register, handleSubmit } = useForm({
		defaultValues: savedState && savedState.input ? savedState.input : ''
	})

	const columnDefs = savedState && savedState.columnDefs
		? savedState.columnDefs
		: initialColumnDefs

	const onSubmit = input => {
		filter(input)
		window.localStorage.setItem(KEY, JSON.stringify({
			...JSON.parse(window.localStorage.getItem(KEY)),
			input: input,
		}))
	}

	const resetToDefault = () => {
		const defaultSavedState = {
			input: [],
			columnDefs: initialColumnDefs,
		}
		setSavedState(defaultSavedState)
		window.localStorage.setItem(KEY, JSON.stringify(defaultSavedState))
	}

	const onDisplayedColumnsChanged = (params) => {
		const columnApi = params.columnApi
		const newSavedState = {
			...savedState,
			columnDefs: columnApi.getAllDisplayedColumns().map(column => column.colDef),
		}
		//setSavedState(newSavedState)
		window.localStorage.setItem(KEY, JSON.stringify(newSavedState))
		console.log('a')
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} onReset={resetToDefault}>
				<h5>Filter:</h5>
				<div>
					<label>Make</label>
					<input name="make" ref={register()} />
				</div>

				<div>
					<label>Model</label>
					<input name="model" ref={register()} />
				</div>

				<div>
					<label>Price</label>
					<input placeholder="Min price" name="minPrice" ref={register()} />
					<br />
					<input placeholder="Max price" name="maxPrice" ref={register()} />
				</div>

				<button type="submit">
					Apply
				</button>

				<button type="reset">
					Reset
				</button>
			</form>

			<div
				className="ag-theme-alpine"
				style={{
					height: '200px',
					width: '620px',
				}}
			>
				<AgGridReact
					onDragStopped={onDisplayedColumnsChanged}
					columnDefs={columnDefs}
					rowData={data}>
				</AgGridReact>
			</div>
		</div>
	)
}

export default App
