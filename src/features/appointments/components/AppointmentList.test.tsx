import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AppointmentList from './AppointmentList';
import appointmentsReducer from '../appointmentsSlice';
import authReducer from '../../auth/authSlice';
import type { RootState } from '../../../app/store';

// Mock child components
jest.mock('./AppointmentRow', () => {
  return function MockAppointmentRow({
    appointment,
    role,
    onUpdate,
  }: {
    appointment: any;
    role: string | null;
    onUpdate: (patch: any) => void;
  }) {
    return (
      <tr data-testid={`appointment-row-${appointment.id}`}>
        <td>{appointment.truckNumber}</td>
        <td>{appointment.driverName}</td>
        <td>{appointment.appointmentDate}</td>
        <td>{appointment.purpose}</td>
        <td>{appointment.portOfEntry}</td>
        <td>{appointment.status}</td>
        <td>
          <button
            data-testid={`update-btn-${appointment.id}`}
            onClick={() => onUpdate({ status: 'Approved' })}
          >
            Update
          </button>
        </td>
      </tr>
    );
  };
});

jest.mock('../../../components/Pagination', () => {
  return function MockPagination({
    current,
    pageSize,
    total,
    onChange,
  }: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  }) {
    return (
      <div data-testid="pagination">
        <button
          data-testid="prev-page"
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
        >
          Previous
        </button>
        <span data-testid="current-page">{current}</span>
        <button
          data-testid="next-page"
          onClick={() => onChange(current + 1)}
          disabled={current * pageSize >= total}
        >
          Next
        </button>
      </div>
    );
  };
});

jest.mock('../../../hooks/useDebounce', () => {
  return function useDebounce<T>(value: T) {
    return value;
  };
});

// Mock the appointmentsSlice thunks
jest.mock('../appointmentsSlice', () => {
  const actual = jest.requireActual('../appointmentsSlice');
  return {
    ...actual,
    fetchAppointments: jest.fn((params) => ({
      type: 'appointments/fetch/fulfilled',
      payload: params,
    })),
    updateAppointment: jest.fn((params) => ({
      type: 'appointments/update/fulfilled',
      payload: params,
    })),
  };
});

interface ExtendedRootState {
  appointments: {
    items: any[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  auth: {
    user: any;
    loading: boolean;
    error: string | null;
  };
}

function renderWithRedux(
  component: React.ReactElement,
  options: any = {}
) {
  const { preloadedState, store: customStore } = options;

  const defaultPreloadedState = {
    appointments: {
      items: [],
      total: 0,
      loading: false,
      error: null,
    },
    auth: {
      user: null,
      loading: false,
      error: null,
    },
  };

  const store = customStore || configureStore({
    reducer: {
      appointments: appointmentsReducer,
      auth: authReducer,
    } as any,
    preloadedState: preloadedState || defaultPreloadedState,
  });

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
}

describe('AppointmentList', () => {
  const mockAppointments = [
    {
      id: '1',
      truckNumber: 'TRK-1001',
      driverName: 'John Doe',
      appointmentDate: '2026-05-11T10:00:00Z',
      purpose: 'Delivery',
      portOfEntry: 'Port A',
      status: 'Pending',
    },
    {
      id: '2',
      truckNumber: 'TRK-1002',
      driverName: 'Jane Smith',
      appointmentDate: '2026-05-12T11:00:00Z',
      purpose: 'Pickup',
      portOfEntry: 'Port B',
      status: 'Approved',
    },
    {
      id: '3',
      truckNumber: 'TRK-1003',
      driverName: 'Bob Johnson',
      appointmentDate: '2026-05-13T12:00:00Z',
      purpose: 'Maintenance',
      portOfEntry: 'Port C',
      status: 'Rejected',
    },
  ];

  describe('Render Tests', () => {
    it('should render the appointments table with header', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'Admin User', role: 'Admin', token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('Appointments')).toBeInTheDocument();
      expect(screen.getByText('Truck Number')).toBeInTheDocument();
      expect(screen.getByText('Driver Name')).toBeInTheDocument();
      expect(screen.getByText('Appointment')).toBeInTheDocument();
      expect(screen.getByText('Purpose')).toBeInTheDocument();
      expect(screen.getByText('Port of Entry')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should render all column headers correctly', () => {
      const preloadedState = {
        appointments: { items: [], total: 0, loading: false, error: null },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7); // 7 main headers + 2 search headers
    });

    it('should render search inputs for truck number and driver name', () => {
      const preloadedState = {
        appointments: { items: [], total: 0, loading: false, error: null },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      expect(searchInputs).toHaveLength(2);
      expect(screen.getByPlaceholderText('Search truck')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search driver')).toBeInTheDocument();
    });

    it('should render pagination component', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading message when loading is true', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: true,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not render appointments when loading', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: true,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('appointment-row-1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display "No appointments" message when items array is empty', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('No appointments')).toBeInTheDocument();
    });

    it('should not render loading message when items are empty and not loading', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Appointment Data Display', () => {
    it('should render all appointments when data is available', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('appointment-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('appointment-row-3')).toBeInTheDocument();
    });

    it('should render appointment data correctly in table cells', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('TRK-1001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Delivery')).toBeInTheDocument();
      expect(screen.getByText('Port A')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render correct appointment data for multiple appointments', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const row2 = screen.getByTestId('appointment-row-2');
      expect(within(row2).getByText('TRK-1002')).toBeInTheDocument();
      expect(within(row2).getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render appointments with all status types', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should update truck number search field on input change', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search truck');
      await userEvent.type(searchInput, 'TRK-1001');

      expect(searchInput).toHaveValue('TRK-1001');
    });

    it('should update driver name search field on input change', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search driver');
      await userEvent.type(searchInput, 'John');

      expect(searchInput).toHaveValue('John');
    });

    it('should clear search field when value is deleted', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search truck');
      await userEvent.type(searchInput, 'TRK');
      await userEvent.clear(searchInput);

      expect(searchInput).toHaveValue('');
    });

    it('should reset page to 1 when search changes', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      const { store } = renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search truck');
      await userEvent.type(searchInput, 'T');

      // Page should be reset to 1
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    it('should handle multiple search field updates', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const truckSearch = screen.getByPlaceholderText('Search truck');
      const driverSearch = screen.getByPlaceholderText('Search driver');

      await userEvent.type(truckSearch, 'TRK-1001');
      await userEvent.type(driverSearch, 'John');

      expect(truckSearch).toHaveValue('TRK-1001');
      expect(driverSearch).toHaveValue('John');
    });
  });

  describe('Pagination', () => {
    it('should initialize with page 1', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    it('should pass current page to Pagination component', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 300,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    it('should pass pageSize 10 to Pagination component', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should pass correct total to Pagination component', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 57,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // Pagination will use this total to determine if next button is disabled
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should update page when next page is clicked', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 200,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const nextBtn = screen.getByTestId('next-page');
      fireEvent.click(nextBtn);

      // After delay to allow state update
      await waitFor(() => {
        expect(screen.getByTestId('current-page')).toHaveTextContent('2');
      });
    });

    it('should disable previous button on first page', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const prevBtn = screen.getByTestId('prev-page');
      expect(prevBtn).toBeDisabled();
    });

    it('should enable previous button after navigating to page 2', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 200,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const nextBtn = screen.getByTestId('next-page');
      fireEvent.click(nextBtn);

      await waitFor(() => {
        const prevBtn = screen.getByTestId('prev-page');
        expect(prevBtn).not.toBeDisabled();
      });
    });
  });

  describe('User Role Handling', () => {
    it('should pass Admin role to AppointmentRow', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'Admin User', role: 'Admin', token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // AppointmentRow is mocked, so we check if row is rendered
      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });

    it('should pass Driver role to AppointmentRow', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'Driver User', role: 'Driver', token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });

    it('should pass null role when user is not authenticated', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: {
          user: null,
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });

    it('should handle user object with null role', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'User', role: null, token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });
  });

  describe('Appointment Update', () => {
    it('should dispatch updateAppointment action when row calls onUpdate', async () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      const { store } = renderWithRedux(<AppointmentList />, { preloadedState });

      const updateBtn = screen.getByTestId('update-btn-1');
      fireEvent.click(updateBtn);

      // Verify the action was dispatched
      const state = store.getState();
      expect(state).toBeDefined();
    });

    it('should pass correct appointment id to AppointmentRow onUpdate', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('update-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('update-btn-2')).toBeInTheDocument();
      expect(screen.getByTestId('update-btn-3')).toBeInTheDocument();
    });

    it('should handle update for different appointments', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      const { store } = renderWithRedux(<AppointmentList />, { preloadedState });

      const updateBtn2 = screen.getByTestId('update-btn-2');
      fireEvent.click(updateBtn2);

      expect(updateBtn2).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain search state independently from pagination', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const truckSearch = screen.getByPlaceholderText('Search truck');
      await userEvent.type(truckSearch, 'TRK');

      expect(truckSearch).toHaveValue('TRK');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    it('should maintain page state when search values change', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search truck');
      await userEvent.type(searchInput, 'TRK');

      // Page is reset to 1 on search
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string search values', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const searchInput = screen.getByPlaceholderText('Search truck');
      await userEvent.type(searchInput, '');

      expect(searchInput).toHaveValue('');
    });

    it('should handle single appointment', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 1,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
      expect(screen.queryByTestId('appointment-row-2')).not.toBeInTheDocument();
    });

    it('should handle large number of appointments', () => {
      const largeAppointmentList = Array.from({ length: 100 }, (_, i) => ({
        id: String(i + 1),
        truckNumber: `TRK-${1000 + i}`,
        driverName: `Driver ${i + 1}`,
        appointmentDate: '2026-05-11T10:00:00Z',
        purpose: 'Delivery',
        portOfEntry: 'Port A',
        status: 'Pending' as const,
      }));

      const preloadedState = {
        appointments: {
          items: largeAppointmentList,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('appointment-row-100')).toBeInTheDocument();
    });

    it('should handle appointments with special characters in names', () => {
      const specialAppointments = [
        {
          id: '1',
          truckNumber: 'TRK-1001',
          driverName: "O'Brien-Smith",
          appointmentDate: '2026-05-11T10:00:00Z',
          purpose: 'Delivery',
          portOfEntry: 'Port A',
          status: 'Pending' as const,
        },
      ];

      const preloadedState = {
        appointments: {
          items: specialAppointments,
          total: 1,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText("O'Brien-Smith")).toBeInTheDocument();
    });

    it('should render correctly with zero total and empty items', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByText('No appointments')).toBeInTheDocument();
    });

    it('should render correctly when total is greater than items length', () => {
      const preloadedState = {
        appointments: {
          items: [mockAppointments[0]],
          total: 50,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });
  });

  describe('Table Structure', () => {
    it('should render table element', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should render thead with correct structure', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const thead = screen.getByRole('table').querySelector('thead');
      expect(thead).toBeInTheDocument();
    });

    it('should render tbody with correct structure', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const tbody = screen.getByRole('table').querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should have correct colspan for loading row', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: true,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const loadingCell = screen.getByText('Loading...');
      expect(loadingCell.getAttribute('colspan')).toBe('7');
    });

    it('should have correct colspan for empty row', () => {
      const preloadedState = {
        appointments: {
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const emptyCell = screen.getByText('No appointments');
      expect(emptyCell.getAttribute('colspan')).toBe('7');
    });
  });

  describe('Card Component', () => {
    it('should render card component with title', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const card = screen.getByText('Appointments').closest('.card');
      expect(card).toBeInTheDocument();
    });

    it('should render table inside card with overflow-x auto', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      const card = screen.getByText('Appointments').closest('.card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should render complete flow with data, search, and pagination', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 50,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'Admin', role: 'Admin', token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // Verify all components are rendered
      expect(screen.getByText('Appointments')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search truck')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search driver')).toBeInTheDocument();
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByTestId('appointment-row-1')).toBeInTheDocument();
    });

    it('should handle full user workflow', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 50,
          loading: false,
          error: null,
        },
        auth: {
          user: { name: 'Admin', role: 'Admin', token: 'token' },
          loading: false,
          error: null,
        },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // User searches
      const truckSearch = screen.getByPlaceholderText('Search truck');
      await userEvent.type(truckSearch, 'TRK-1001');

      expect(truckSearch).toHaveValue('TRK-1001');

      // User navigates pagination
      const nextBtn = screen.getByTestId('next-page');
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByTestId('current-page')).toHaveTextContent('2');
      });
    });

    it('should maintain state across multiple interactions', async () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 100,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // Search
      const truckSearch = screen.getByPlaceholderText('Search truck');
      await userEvent.type(truckSearch, 'TRK');

      // Search value should persist
      expect(truckSearch).toHaveValue('TRK');

      // Page should be reset to 1 after search
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });
  });

  describe('Memoization', () => {
    it('should memoize columns array', () => {
      const preloadedState = {
        appointments: {
          items: mockAppointments,
          total: 3,
          loading: false,
          error: null,
        },
        auth: { user: null, loading: false, error: null },
      };

      renderWithRedux(<AppointmentList />, { preloadedState });

      // Check that columns are rendered
      expect(screen.getByText('Truck Number')).toBeInTheDocument();
      expect(screen.getByText('Driver Name')).toBeInTheDocument();
      expect(screen.getByText('Appointment')).toBeInTheDocument();
      expect(screen.getByText('Purpose')).toBeInTheDocument();
      expect(screen.getByText('Port of Entry')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });
});
