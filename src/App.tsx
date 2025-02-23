import { createTheme, MantineProvider } from '@mantine/core';
import { MapUI } from './components/Map'
import '@mantine/core/styles.css';
import PaginatedTable from './components/Table';
import { useMapData } from './hooks/useMapData';
import FormContainer from './containers/form';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {

  const mapData = useMapData()
  const { data,
    setPage,
    loading,
    limit,
    page,
    paginatedData,
    setSelectedId,
    selectedId,
    filterData,
    insidePoints,
    setInsidePoints, filterDataForMap,setlimit, reset } = mapData()
  return (
    <MantineProvider theme={theme}>
      <div className='mt-10 px-10'>
        <FormContainer
        reset={reset}
          gps_codes={data.map(item => item?.gps_code)}
          filterData={filterData} />
        <div className={'   rounded-3xl  gap-x-5 min-h-[600px] ' + (limit > 20 ? "block" : "flex  ")}>
          <div className={" flex-7/12 items-center " + (limit > 20 ? " h-[700px] mb-5" : "")}>
            <MapUI data={paginatedData}
              filterDataForMap={filterDataForMap}
              allList={data}
              selectedCordinateId={selectedId}
              insidePoints={insidePoints}
              setInsidePoints={setInsidePoints} 
              setSelectedId={setSelectedId}/>
          </div>
          <div className=' flex-5/12  '>
            <PaginatedTable data={data}
              paginatedData={paginatedData}
              setPage={setPage}
              loading={loading}
              setlimit={setlimit}
              limit={limit}
              page={page}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              insidePoints={insidePoints}
            />
          </div>
        </div>
      </div>
    </MantineProvider>


  )
}

export default App
