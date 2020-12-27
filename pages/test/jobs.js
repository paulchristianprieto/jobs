import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

import Jobs from '../../components/jobs-list'
import '../../styles/styles.css'

const Landing = ({ jobs }) => {
  const [jobsList, setJobsList] = useState(jobs)
  const [jobsByCompany, setJobsByCompany] = useState(new Map())
  const [activeGrouping, setActiveGrouping] = useState('none')
  const [withinTheWeek, setWithinTheWeek] = useState(false)


  // this is the handler for grouping the jobs by company name.
  const handleGroupByCompany = () => {
    const jobsGroupedByCompany = groupBy(jobs, job => job.companyName)

    // updateJobsByCompanyState
    setJobsByCompany(jobsGroupedByCompany)

    // setActiveGrouping if to let the user know that the data they are viewing is grouped by company name
    activeGrouping === 'company' ? setActiveGrouping('none') : setActiveGrouping('company')
  }

  const handleLast7days = (jobsArray) => {
    // Reset the data if the filter for within the week is not active
    if (withinTheWeek) {
      // if within the week is true, reset the data to thedata without the filter using the data from props and disable thecue that the last 7 days button is active
      setJobsList(jobs)
      setWithinTheWeek(false)
    }
    else {
      // filter thedata if the user clicks on last 7 days button
      const filteredJobsArray = jobsArray.filter((job) => {
        const days = parseInt(job.postedDate.substring(0, 1));
        return days <= 7
      })
      // set the jobs list as the filtered array
      setJobsList(filteredJobsArray)
      // set within the week will be the cue for the user to know if the data they are viewing is with the last 7 days filter
      setWithinTheWeek(true)
    }
  }

  const JobsByCompany = ({ jobsMap }) => {
    // convert the Map to an array to be able to display the data using the map function
    const jobsArray = Array.from(jobsMap, ([company, jobs]) => ({ company, jobs }));

    // display the jobs by company name
    return jobsArray.map(company => {
      let jobs = company.jobs

      // check if within the week button is active, if it is active I'll be filtering out the jobs within the 7 days
      if (withinTheWeek) {
        jobs = jobs.filter((job) => {
          const days = parseInt(job.postedDate.substring(0, 1));
          return days <= 7
        })
      }

      // there will be an instance where the jobs left after filtering will be 0 so I put a handler here to not display the company name that has no jobs available.
      if (jobs.length)
        return (
          <Col sm={12} md={12} key={company.company} >
            <div>
              <h1 className="company-name">{company.company}</h1>
              <Row className="jobs-container">
                <Jobs jobsArray={jobs} large />
              </Row>
            </div>
          </Col>
        )

      // I would have used a react fragment but that will give an error/warning that each child in a map component should have a unique key prop
      return <div key={company.company} />
    })
  }

  // I created this function to group the list of jobs by company id
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
