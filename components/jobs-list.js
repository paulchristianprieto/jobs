import React, { useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';

const Jobs = ({ jobsArray, numberOfJobs, large }) => {
  const handleLogoError = (link) => {
    return 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg'
  }

  return jobsArray.map((job, index) => {
    const {
      listingHash,
      jobDLPUrl,
      jobTitle,
      companyName,
      companyLogo,
      estimatedSalary,
      shortDesc,
      postedDate
    } = job

    if (index >= numberOfJobs) return

    return (
      <Col key={listingHash} xs={12} sm={large ? 12 : 6} md={large ? 12 : 4} lg={large ? 6 : 3} className="card-col">
        <Card className="card" onClick={() => window.open(`https://zippia.com/${jobDLPUrl}`)} >
          <div className="card-container">
            {companyLogo && <Card.Img variant="top" src={companyLogo} className="company-logo" onError={() => handleLogoError(companyLogo)} />}
            <Card.Body>
              <Card.Title className="card-job-title">{jobTitle}</Card.Title>
              <Card.Subtitle className="card-job-company">{companyName}</Card.Subtitle>
              <Card.Subtitle className="card-job-salary">{estimatedSalary}</Card.Subtitle>
              <Card.Text className="card-job-description">
                {shortDesc} {postedDate}
              </Card.Text>
            </Card.Body>
          </div>
        </Card>
      </Col>
    )
  })
}

export default Jobs