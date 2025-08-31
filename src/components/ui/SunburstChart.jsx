import React, { useState, useEffect } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { Box, Button } from '@mui/material';

const SunburstChart = ({ data }) => {
    const [chartData, setChartData] = useState(data);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        // When the parent data changes, reset the view
        setChartData(data);
        setIsZoomed(false);
    }, [data]);

    const handleNodeClick = (node) => {
        if (node.data && node.data.children) {
            setChartData(node.data);
            setIsZoomed(true);
        }
    };

    const handleResetZoom = () => {
        setChartData(data);
        setIsZoomed(false);
    };

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            {isZoomed && (
                <Button
                    onClick={handleResetZoom}
                    size="small"
                    sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
                >
                    Reset Zoom
                </Button>
            )}
            <ResponsiveSunburst
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                id="name"
                value="loc"
                cornerRadius={2}
                borderWidth={1}
                borderColor="white"
                colors={{ scheme: 'nivo' }}
                childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
                enableArcLabels={true}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                onClick={handleNodeClick}
            />
        </Box>
    );
};

export default SunburstChart;
