const API = "https://golden-transport-backend.onrender.com";

export async function addTruck(
  driverId: number,
  data: any
) {
  const response = await fetch(
    `${API}/driver/add-truck?driver_id=${driverId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return await response.json();
}

export async function getMyTrucks(driverId:number){

    const response = await fetch(
        `${API}/driver/my-trucks?driver_id=${driverId}`
    );

    return await response.json();
}