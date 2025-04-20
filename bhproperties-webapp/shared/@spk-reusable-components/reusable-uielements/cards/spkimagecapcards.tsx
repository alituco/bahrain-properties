import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'

interface Imgcap {
  Imgsrc?: string
  Footertext?: string;
  CustomTitleclass?: string;
  Customimgclass?: string;
  Custombodyclass?: string;
  Customfooterclass?: string;
  Text?: string;
  Title?: string;
  CustomClass?: string;
  children?: React.ReactNode;
  Cardheader?: boolean;
  CardFooter?: boolean;
  Imgposition?: string;
  Customclass?: string;
  Imgafterfooter?: boolean;
}

const Spkimagecapcards: React.FC<Imgcap> = ({ Cardheader = false, Customclass, Title, Imgafterfooter = false, Imgposition, children, CustomTitleclass, Customimgclass, Custombodyclass, Customfooterclass, Imgsrc, CardFooter = false, Footertext }) => {
  return (
    <Fragment>
      <Card className={`custom-card ${Customclass}`}>
        {Imgposition === "before" ?
          <>
            <img src={Imgsrc} className={Customimgclass} alt="..." />
          </>
          : ""}
        {Cardheader ?
          <Card.Header>
            <Card.Title className={CustomTitleclass}>{Title}</Card.Title>
          </Card.Header> : ''}

        <Card.Body className={Custombodyclass}>
          {children}
        </Card.Body>

        {Imgposition === "after" ?
          <>
            <img src={Imgsrc} className={Customimgclass} alt="..." />
          </>
          : ""}

        {CardFooter ?
          <Card.Footer className={Customfooterclass}>
            <p className="card-text mb-0"><small>{Footertext}</small></p>
          </Card.Footer> : ""}
        {Imgafterfooter ?
          <>
            <img src={Imgsrc} className={Customimgclass} alt="..." />
          </>
          : ""}
      </Card>
    </Fragment>
  )
}

export default Spkimagecapcards