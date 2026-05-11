// src/api/appointments.api.ts
import axiosapi from "../axios-setup";

export type AppointmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface Appointment {
  id: string;
  truckNumber: string;
  driverName: string;
  appointmentDate: string;
  purpose: string;
  portOfEntry: string;
  status: string;
  comments?: string;
}

let DB: Appointment[] = Array.from({ length: 57 }).map((_, i) => {
  const statuses: AppointmentStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
  const purposes = ['Delivery', 'Pickup', 'Maintenance'];
  const ports = ['Port A', 'Port B', 'Port C'];
  return {
    id: String(i + 1),
    truckNumber: `TRK-${1000 + i}`,
    driverName: `Driver ${i % 12 + 1}`,
    appointmentDate: new Date(Date.now() + i * 24 * 3600 * 1000).toISOString(),
    purpose: purposes[i % purposes.length],
    portOfEntry: ports[i % ports.length],
    status: statuses[i % statuses.length],
    comments: '',
  };
});

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}
 
export async function fetchAppointments({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: Record<string, string>;
} ): Promise<{ data: Appointment[]; total: number }> {
  await delay(350);
 // const response = await axiosapi.get("/TruckAppointment/fetch");
  try {
    const response = await axiosapi.get("/TruckAppointment/fetch", {
      params: {
        page,
        pageSize,
        ...search,
      },
    });
    return { data: response.data.data, total: response.data.total };

  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }

}

export async function fetchAppointmentsMock({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: Record<string, string>;
}): Promise<{ data: Appointment[]; total: number }> {
  await delay(350);
  let items = DB.slice();

  if (search) {
    Object.entries(search).forEach(([k, v]) => {
      if (!v) return;
      items = items.filter((it) =>
        String((it as any)[k]).toLowerCase().includes(v.toLowerCase())
      );
    });
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total };
}

export async function createAppointment(
  payload: Partial<Appointment>
): Promise<Appointment> {
  await delay(300); // optional artificial delay

  try {
    const response = await axiosapi.post<Appointment>(
      "/TruckAppointment/create",
      {
        truckNumber: payload.truckNumber ?? "UNKNOWN",
        driverName: payload.driverName ?? "UNKNOWN",
        appointmentDate: payload.appointmentDate ?? new Date().toISOString(),
        purpose: payload.purpose ?? "Delivery",
        portOfEntry: payload.portOfEntry ?? "Port A",
        comments: payload.comments ?? ""
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

export async function createAppointmentMock(payload: Partial<Appointment>): Promise<Appointment> {
  await delay(300);
  const newItem: Appointment = {
    id: String(DB.length + 1),
    truckNumber: payload.truckNumber || 'UNKNOWN',
    driverName: payload.driverName || 'UNKNOWN',
    appointmentDate: payload.appointmentDate || new Date().toISOString(),
    purpose: payload.purpose || 'Delivery',
    portOfEntry: payload.portOfEntry || 'Port A',
    status: 'Pending',
    comments: payload.comments || '',
  };
  DB.unshift(newItem);
  return newItem;
}

export async function updateAppointmentMock(id: string, patch: Partial<Appointment>): Promise<Appointment> {
  await delay(300);
  const idx = DB.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error('Appointment not found');
  DB[idx] = { ...DB[idx], ...patch };
  return DB[idx];
}


export async function updateAppointment(
  id: string,
  patch: Partial<Appointment>
): Promise<Appointment> {
  await delay(300); // optional artificial delay
  patch.id = id; // Ensure the ID is included in the patch for the API
  try {
    debugger;
    const response = await axiosapi.put<Appointment>(
      `/TruckAppointment/update`,
      patch
    );

    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}
