import Link from 'next/link';
import React from 'react';
import { Card } from "react-bootstrap";

interface BasicCardProps {
  header?: string;
  children?: React.ReactNode;
  footer?: boolean | React.ReactNode;
  imgSrc?: string;
  title?: string;
  bodyText?: string | object | any;
  titleClass?: string;
  subTitle?: string
  imgClass?: string;
  cardClass?: string;
  bodyClass?: string;
  cardFooter?: string;
  cardHeader?: string;
  useDivHeader?: boolean;
  imgSrcA?: string;
  imgClassA?: string
  imgSrcB?: string;
  imgClassB?: string
  linkTag?: boolean;
}

const BasicCard: React.FC<BasicCardProps> = ({ header, footer, title, bodyText, imgSrc, titleClass, subTitle, imgClass, cardClass, bodyClass, cardHeader, cardFooter, useDivHeader = false, imgSrcA, imgClassA, imgSrcB, imgClassB, linkTag = false }) => {
  return (
    <Card className={`custom-card ${cardClass}`}>

      {imgSrcA && <img src={imgSrcA} alt="..." className={imgClassA} />}
      {linkTag && <Link href="#!" className="card-anchor"></Link>}

      {header && (
        useDivHeader ? (
          <Card.Header className={cardHeader}> {header} </Card.Header>
        ) : (
          <Card.Header className={cardHeader}>
            <h5 className="card-title fw-medium">{header}</h5>
          </Card.Header>
        )
      )}

      {imgSrc && <img src={imgSrc} alt="..." className={imgClass} />}

      <Card.Body className={bodyClass}>
        {title && <h6 className={`card-title ${titleClass}`}>{title}</h6>}
        {subTitle && <h6 className="card-subtitle mb-3 text-muted ">{subTitle}</h6>}
        {bodyText}
      </Card.Body>

      {imgSrcB && <img src={imgSrcB} alt="..." className={imgClassB} />}

      {footer && (
        <Card.Footer className={cardFooter}>
          {typeof footer === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: footer }} />
          ) : (
            footer
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default BasicCard;
