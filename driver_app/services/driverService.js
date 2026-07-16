import API from "./api";

// =============================
// GET DRIVER TRIPS
// =============================
export const getDriverTrips = async (driverId) => {
  const response = await API.get(
    `/driver/my-trips/${driverId}`
  );

  return response.data;
};

// =============================
// UPDATE TRIP STATUS
// =============================
export const updateTripStatus = async (
  tripId,
  status
) => {
  const response = await API.post(
    "/driver/update-trip-status",
    {
      trip_id: tripId,
      status,
    }
  );

  return response.data;
};