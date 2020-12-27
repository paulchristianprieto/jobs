import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

import Jobs from '../../components/jobs-list'
import '../../styles/styles.css'

const Landing = ({ jobs }) => {

  console.log(jobs)
  const [jobsList, setJobsList] = useState(jobs)
  const [jobsByCompany, setJobsByCompany] = useState(new Map())
  const [activeGrouping, setActiveGrouping] = useState('none')
  const [withinTheWeek, setWithinTheWeek] = useState(false)


  const handleGroupByCompany = () => {
    const jobsGroupedByCompany = groupBy(jobs, job => job.companyName)
    setJobsByCompany(jobsGroupedByCompany)

    activeGrouping === 'company' ? setActiveGrouping('none') : setActiveGrouping('company')
  }

  const handleLast7days = (jobsArray) => {
    if (withinTheWeek) {
      setJobsList(jobs)
      setWithinTheWeek(false)
    }
    else {
      const filteredJobsArray = jobsArray.filter((job) => {
        const days = parseInt(job.postedDate.substring(0, 1));
        return days <= 7
      })
      setJobsList(filteredJobsArray)
      setWithinTheWeek(true)
    }
  }

  const JobsByCompany = ({ jobsMap }) => {
    const jobsArray = Array.from(jobsMap, ([company, jobs]) => ({ company, jobs }));

    return jobsArray.map(company => {
      let jobs = company.jobs

      if (withinTheWeek) {
        jobs = jobs.filter((job) => {
          const days = parseInt(job.postedDate.substring(0, 1));
          return days <= 7
        })
      }

      if (jobs.length)
        return (
          <Col sm={12} md={12} >
            <div>
              <h1 className="company-name">{company.company}</h1>
              <Row className="jobs-container">
                <Jobs jobsArray={jobs} large />
              </Row>
            </div>
          </Col>
        )

      return <></>
    })
  }

  // I careted this function to group the list of jobs by company id
  const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Jobs</h1>
        </Col>
      </Row>
      <Row className="buttons-row">
        <Col md={4} className="buttons-col">
          <Button variant={activeGrouping === 'company' ? 'dark' : 'light'} className="button" onClick={handleGroupByCompany}>Group ByCompany</Button>
          <Button variant={withinTheWeek ? 'dark' : 'light'} className="button" onClick={() => handleLast7days(jobsList)}>Last 7 days</Button>
        </Col>
      </Row>
      {activeGrouping === 'none' ?
        <Row className="jobs-container">
          <Jobs jobsArray={jobsList} numberOfJobs={10} />
        </Row> :
        <Row className="jobs-container">
          <JobsByCompany jobsMap={jobsByCompany} />
        </Row>
      }


    </Container>
  )
}

export async function getStaticProps() {
  const res = await fetch(`https://www.zippia.com/api/jobs/`, {
    method: "POST",
    body: JSON.stringify({
      "companySkills": true,
      "dismissedListingHashes": [],
      "fetchJobDesc": true,
      "jobTitle": "Business Analyst",
      "locations": [],
      "numJobs": 40,
      "previousListingHashes": []
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: { jobs: [...data.jobs] } }
}

export default Landing;
