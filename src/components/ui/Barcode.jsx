import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value, ...options }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 14,
        ...options,
      });
    }
  }, [value, options]);

  return <svg ref={svgRef} />;
};

export default Barcode;
