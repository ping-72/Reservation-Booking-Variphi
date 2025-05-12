import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ticketService } from "../../services/ticket.service";
import type {
  Flight,
  SearchFlightsRequest,
  TicketState,
} from "../../types/ticket.types";

const initialState: TicketState = {
  flights: [],
  selectedFlight: null,
  loading: false,
  error: null,
  searchParams: null,
  airlines: [],
  popularRoutes: [],
};

export const searchFlights = createAsyncThunk<Flight[], SearchFlightsRequest>(
  "ticket/searchFlights",
  async (params, { rejectWithValue }) => {
    try {
      return await ticketService.searchFlights(params);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getFlightById = createAsyncThunk<Flight, string>(
  "ticket/getFlightById",
  async (id, { rejectWithValue }) => {
    try {
      return await ticketService.getFlightById(id);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getAirlines = createAsyncThunk(
  "ticket/getAirlines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketService.getAirlines();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get airlines");
      }
      return rejectWithValue("Failed to get airlines");
    }
  }
);

export const getPopularRoutes = createAsyncThunk(
  "ticket/getPopularRoutes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketService.getPopularRoutes();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get popular routes");
      }
      return rejectWithValue("Failed to get popular routes");
    }
  }
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearSelectedFlight: (state) => {
      state.selectedFlight = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search flights
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchFlights.fulfilled,
        (state, action: PayloadAction<Flight[]>) => {
          state.flights = action.payload;
          state.loading = false;
        }
      )
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get flight by id
      .addCase(getFlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFlightById.fulfilled,
        (state, action: PayloadAction<Flight>) => {
          state.selectedFlight = action.payload;
          state.loading = false;
        }
      )
      .addCase(getFlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Airlines
      .addCase(getAirlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAirlines.fulfilled, (state, action) => {
        state.loading = false;
        state.airlines = action.payload;
      })
      .addCase(getAirlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Popular Routes
      .addCase(getPopularRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopularRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.popularRoutes = action.payload;
      })
      .addCase(getPopularRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFlights, clearErrors, clearSelectedFlight } =
  ticketSlice.actions;

export const selectTicketState = (state: { ticket: TicketState }) =>
  state.ticket;

export default ticketSlice.reducer;
