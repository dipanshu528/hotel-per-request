import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const App = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: [],
    },
  });
  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Number of Requests',
      data: [],
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://checkinn.co/api/v1/int/requests');
      const requestData = response.data;

      // Calculate total requests
      setTotalRequests(requestData.requests.length);

      // Extract unique department names
      const departments = new Set();
      requestData.requests.forEach(request => {
        departments.add(request.desk.name);
      });
      const uniqueDepartmentsArray = Array.from(departments);
      setUniqueDepartments(uniqueDepartmentsArray);

      // Prepare data for chart
      const departmentCounts = uniqueDepartmentsArray.map(department => {
        const count = requestData.requests.filter(request => request.desk.name === department).length;
        return count;
      });

      setChartOptions({
        ...chartOptions,
        xaxis: {
          ...chartOptions.xaxis,
          categories: uniqueDepartmentsArray,
        },
      });

      setChartSeries([
        {
          name: 'Number of Requests',
          data: departmentCounts,
        },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Total requests: {totalRequests}</h1>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      <h2 style={{ textAlign: 'center' }}>List of unique department names across all Hotels:</h2>
      <ul style={{ textAlign: 'center' }}>
        {uniqueDepartments.map((department, index) => (
          <li key={index}>{department}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
