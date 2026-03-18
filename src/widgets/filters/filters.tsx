// components/widgets/filters/Filters.tsx
import React from 'react';

const Filters = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-4">Фильтры</h3>
      <div className="space-y-4">
        <div>
          <h4>Цена</h4>
          <input type="range" className="w-full" />
        </div>
        <div>
          <h4>Высота</h4>
          <select className="w-full p-2 border rounded">
            <option>100-120 см</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;