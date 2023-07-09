import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Container, Fab, IconButton, Pagination, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import apiService from "../app/apiService";
import ConfirmModal from "../components/ConfirmModal";
import FormModal from "../components/FormModal";

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mode, setMode] = useState("create");

  const handleClickNew = () => {
    setMode("create");
    setOpenForm(true);
  };

  const handleClickEdit = (id) => {
    setMode("edit");
    setSelectedCar(cars.find((car) => car._id === id));
    setOpenForm(true);
  };

  const handleClickDelete = (id) => {
    setOpenConfirm(true);
    setSelectedCar(cars.find((car) => car._id === id));
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/car/${selectedCar._id}`);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const name =
    selectedCar?.release_date +
    " " +
    selectedCar?.make +
    " " +
    selectedCar?.model;
  const columns = [
    { field: "name", headerName: "Name", flex: 3, minWidth: 120 },
    { field: "style", headerName: "Style", flex: 1, minWidth: 120 },
    { field: "size", headerName: "Size", flex: 1, minWidth: 100 },
    {
      field: "transmission_type",
      headerName: "Transmission Type",
      flex: 1.5,
      minWidth: 120,
    },
    { field: "price", headerName: "Price", flex: 1, minWidth: 80 },
    { field: "release_date", headerName: "Year", flex: 1, minWidth: 80 },
    {
      field: "id",
      headerName: "Edit/Delete",
      minWidth: 120,
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleClickEdit(value)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleClickDelete(value)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const getData = useCallback(async () => {
    const res = await apiService.get(`/car?page=${page}`);
    console.log("running getData");
    console.log(`/car?page=${page}`);
    console.log(res.data);
    setCars(res.data.data);
    console.log("running setCars");
    //console.log(cars);
    setTotalPages(res.data.total);
    //setTotalPages(10);
    console.log("running setTotalPages");
    console.log(page);
  }, [page]);

  useEffect(() => {
    getData();
  }, [getData]);

  const rows = cars.map((car) => ({
    id: car._id,
    name: car.make + " " + car.model,
    size: car.size,
    style: car.style,
    transmission_type: car.transmission_type,
    price: car.price,
    release_date: car.release_date,
  }));

  return (
    <Container maxWidth="lg" sx={{ pb: 3 }}>
      <ConfirmModal
        open={openConfirm}
        name={name}
        handleClose={() => {
          setOpenConfirm(false);
        }}
        action={handleDelete}
      />
      <FormModal
        open={openForm}
        refreshData={() => {
          setOpenForm(false);
          setSelectedCar(null);
          getData();
        }}
        selectedCar={selectedCar}
        handleClose={() => {
          setOpenForm(false);
          setSelectedCar(null);
        }}
        mode={mode}
      />
      <div style={{ height: 630, width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={rows}
          rowCount={5 * totalPages}
          columns={columns}
          rowsPerPageOptions={[]}
          components={{
            Pagination: () => (
              <Pagination
                color="primary"
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
              />
            ),
          }}
        />
      </div>
      <Fab
        variant="extended"
        color="info"
        onClick={handleClickNew}
        sx={{ position: "fixed", bottom: 10, left: 10 }}
        aria-label="add"
      >
        <AddIcon />
        New
      </Fab>
    </Container>
  );
};
export default HomePage;
