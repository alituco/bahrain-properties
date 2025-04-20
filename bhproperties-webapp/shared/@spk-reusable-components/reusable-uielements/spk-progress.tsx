import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface SpkProgressProps {
    variant?: string;
    now: any;
    mainClass?: string;
    animated?: boolean;
    striped?: boolean;
    children?: any;
    label?: string | number;
    role?: string;
}

const SpkProgress: React.FC<SpkProgressProps> = ({variant, now = 0, mainClass, role, animated = false, striped = false, label}) => {
    return (
        <ProgressBar variant={variant} now={now} className={mainClass} role={role} animated={animated} striped={striped} label={label} />
    );
}

export default SpkProgress;