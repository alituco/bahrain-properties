import React, { Fragment } from "react";
import { Card } from "react-bootstrap";

interface SpkcardscomponentProps {
  cardClass?: string;
  Icon?: boolean;
  textbefore?: boolean;
  textafter?: boolean;
  svgIcon?: JSX.Element;
  mainClass?: string;
  parentClass?: string;
  card?: any;
  badgeClass?: string;
  dataClass?: string;
  headingClass?: string;
  badgeColor?: string;
  iconClass?: string;
  titleStyle?: React.CSSProperties;          
}

const Spkcardscomponent: React.FC<SpkcardscomponentProps> = ({
  card,
  cardClass,
  textbefore = false,
  textafter  = true,
  Icon,
  svgIcon,
  mainClass,
  parentClass,
  dataClass,
  badgeClass,
  headingClass,
  badgeColor,
  iconClass,
  titleStyle,
}) => (
  <Fragment>
    <Card className={`custom-card ${cardClass}`}>
      <Card.Body>
        <div className={mainClass}>
          <div className={`${parentClass} flex-grow-1 me-2`}>
            <span
              className={`text-muted ${headingClass}`}
              style={titleStyle}
            >
              {card.title}
            </span>

            <h4 className={`fw-medium ${dataClass}`}>{card.count}</h4>

            {textbefore && (
              <div className="text-muted fs-13 d-inline-flex">
                {card.inc}
                <span className={`text-${card.color} ms-1`}>
                  {card.percentageChange}
                  <i className={`${card.icon} fs-16`} />
                </span>
              </div>
            )}
          </div>

          <div
            className={`avatar avatar-${badgeClass} bg-${card.backgroundColor} ${badgeColor} flex-shrink-0`}
          >
            {svgIcon || (Icon && <i className={`${iconClass} fs-5`} />)}
          </div>
        </div>

        {textafter && (
          <div className="text-muted fs-13 d-inline-flex">
            {card.inc}
            <span className={`text-${card.color} ms-1`}>
              {card.percentageChange}
              <i className={`${card.icon} fs-16`} />
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  </Fragment>
);

export default Spkcardscomponent;
