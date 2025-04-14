import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface SpkTooltipsProps {
    title: string;
    id?: string;
    children: any;
    tooltipClass?: string;
    trigger?: any
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

const SpkTooltips: React.FC<SpkTooltipsProps> = ({ title, id, children, placement, tooltipClass, trigger }) => {
    return (
        <OverlayTrigger placement={placement} trigger={trigger} delay={{ show: 250, hide: 400 }} overlay={<Tooltip id={id} className={tooltipClass}>{title}</Tooltip>}>
            {children}
        </OverlayTrigger>
    );
}

export default SpkTooltips;
