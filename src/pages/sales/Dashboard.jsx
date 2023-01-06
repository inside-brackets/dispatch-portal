import React from "react";
import { useSelector } from "react-redux";
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import Accordion from "../../components/accordion/Accordion";
import {Card ,Col} from "react-bootstrap"

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const accordionData = [
    {
      title: 'Power Truck is not working possimus labore, hic',
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
      status:'Open'
    },
    {
      title: 'Reefer truck stucked',
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!`,
      status:'Open'
    },
    {
      title: 'Ticket 3',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
      quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
      dolor ut sequi minus iste? Quas?`,
      status:'Open'
    }
  ];
const accordionDataClosed = [
    {
      title: 'Power Truck is not working',
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
      status:'Closed'
    },
    {
      title: 'Reefer truck stucked',
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!`,
      status:'Closed'
    },
    {
      title: 'Ticket 3',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
      quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
      dolor ut sequi minus iste? Quas?`,
      status:'Closed'
    }
  ];
  return (
    <div>
      <div className="row" style={{ marginTop: "30px" }}>
        <Col md="12">
<Card>
    <Card.Body>
      <div className="issue_wrapper">
      <h5> Latest Opened Tickets({accordionData.length})</h5>
      <div className="issue_accordion">
        {accordionData.map(({ title, content,status },index) => (
          <Accordion title={title} content={content} index={index} status={status} />
        ))
        }
      </div>

      <h5> Latest Closed Tickets({accordionData.length})</h5>
      <div className="issue_accordion">
        {accordionDataClosed.map(({ title, content,status },index) => (
          <Accordion title={title} content={content} status={status} index={index} />
        ))
        }
      </div>
    </div>
    </Card.Body>
    </Card>
    </Col>
        <div className="col-8">
          <div className="row">
            <img className="main__img" src={usMap} alt="couldn't find" />
          </div>
        </div>
        <div className="col-4">
          {user.department === "sales" ? (
            <TargetDisplay designation={user.designation} />
          ) : null}
          <UsClock />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
