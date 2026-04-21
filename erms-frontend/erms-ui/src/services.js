const API_BASE_URL = 'http://localhost:8080';

const getAuthToken = () => localStorage.getItem('authToken');

const logout = () => {
  localStorage.removeItem('authToken');
  window.location.reload();
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const registerUser = async (user) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Registration failed');
  }
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Login failed');
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Login failed');
  }
  return data.data;
};

export const createEmployee = async (employeeDto) => {
  const response = await fetchWithAuth('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeDto),
  });
  return response.data;
};

export const getEmployees = async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
  const response = await fetchWithAuth(
    `/employees?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await fetchWithAuth(`/employees/${id}`);
  return response.data;
};

export const updateEmployee = async (id, employeeDto) => {
  const response = await fetchWithAuth(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeDto),
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  return fetchWithAuth(`/employees/${id}`, {
    method: 'DELETE',
  });
};

export const searchEmployeeByName = async (name = '') => {
  const response = await fetchWithAuth(`/employees/search-employee?name=${encodeURIComponent(name)}`);
  return response.data;
};

export const getEmployeesBySalaryRange = async (minSalary, maxSalary) => {
  const response = await fetchWithAuth(
    `/employees/salary-range?minSalary=${minSalary}&maxSalary=${maxSalary}`
  );
  return response.data;
};