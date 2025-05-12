import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { AnyAction } from "@reduxjs/toolkit";
import { searchFlights } from "../../store/slices/ticketSlice";
import { ticketService } from "../../services/ticket.service";
import type { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import type { SearchFlightsRequest } from "../../types/ticket.types";

const validationSchema = Yup.object({
  origin: Yup.string().required("Origin is required"),
  destination: Yup.string().required("Destination is required"),
  departureDate: Yup.date().nullable(),
});

const FlightSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.ticket);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const citiesData = await ticketService.getCities();
        setCities(citiesData);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const formik = useFormik<SearchFlightsRequest>({
    initialValues: {
      origin: "",
      destination: "",
      departureDate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(searchFlights(values) as unknown as AnyAction);
    },
  });

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Search Flights
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                id="origin"
                options={cities}
                loading={loadingCities}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    error={
                      formik.touched.origin && Boolean(formik.errors.origin)
                    }
                    helperText={formik.touched.origin && formik.errors.origin}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCities ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                value={formik.values.origin}
                onChange={(_, value) =>
                  formik.setFieldValue("origin", value || "")
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                id="destination"
                options={cities}
                loading={loadingCities}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    error={
                      formik.touched.destination &&
                      Boolean(formik.errors.destination)
                    }
                    helperText={
                      formik.touched.destination && formik.errors.destination
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCities ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                value={formik.values.destination}
                onChange={(_, value) =>
                  formik.setFieldValue("destination", value || "")
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Departure Date (Optional)"
                  value={
                    formik.values.departureDate
                      ? new Date(formik.values.departureDate)
                      : null
                  }
                  onChange={(value) =>
                    formik.setFieldValue(
                      "departureDate",
                      value ? value.toISOString().split("T")[0] : null
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error:
                        formik.touched.departureDate &&
                        Boolean(formik.errors.departureDate),
                      helperText:
                        formik.touched.departureDate &&
                        formik.errors.departureDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Flights"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FlightSearch;
