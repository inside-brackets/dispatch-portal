import React ,{useState,useEffect} from "react";
import {Button,Form,Spinner} from "react-bootstrap";
import "./carrierIssues.css"
import Accordion from '../../accordion/Accordion';
import Modal from "../../modals/MyModal";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
const CarrierIssues = () => {
  const currUser = useSelector((state) => state.user.user);
    const [show,setShow]=useState()
    const [carrierId,setCarrierId] = useState();
    const [openTickets,setOpenTickets]=useState();
    const [closedTickets,setClosedTickets]=useState();
    const [validated, setValidated] = useState(false);
    console.log(currUser,"currUser")
const [loader,setLoader]=useState(false)
const params = useParams()
const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
useDropzone({});
console.log(acceptedFiles,"acceptedFiles")
const files = acceptedFiles.map((file) => (
<li key={file.path}>{file.path}</li>
))

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
      useEffect(() => {
        axios
          .post(`/getcarrier`, {
            mc_number: params.mc,
          })
          .then(({ data }) => {
            console.log(data)
            setCarrierId(data.salesman._id)
          })},[])
        useEffect(()=>{
          let fetchResponse = async ()=>{
          let {data} = await axios.post('/ticket/get/all',{carrier:carrierId})
          console.log(data,"response=======>")
          setOpenTickets(data.open.tickets)
          setClosedTickets(data.closed.tickets)
          }
          fetchResponse()
        },[])
      const submitHandler=async(e)=>{
        const form = e.currentTarget;
        if (form.checkValidity()) {
        setLoader(true)
        e.preventDefault();

        let arr = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const { data: url } = await axios(
        `/s3url/ticket_documents/${currUser?.user_name
        }.${acceptedFiles[i].type.split("/")[1]}`
      );
      await axios.put(url, acceptedFiles[i]);
      arr[i] = {
        name:acceptedFiles[i].name,
        url:`${url.split("?")[0]}`
      }
    }
    try{
          let createTicket = await axios.post('/ticket/create',{
            title:e.target.title.value, 
            desc:e.target.desc.value,
            carrier:carrierId, 
            dispatcher:currUser._id,
            files:arr
          })
          if(createTicket){
            setLoader(false)
            setShow(false)
            toast.success("Ticket created successfully");
          }
        }catch(error){
            setLoader(false)
            setShow(false)
            toast.error("Ticket creation failed");
        }
        }else{
          setValidated(true);
        }
      }
    return (
    <>
 <div className="issue_wrapper">
   {currUser.department === "admin" || currUser.department ==="dispatch"  ? <div className="create_issue_btn"><Button onClick={()=>{setShow(true)}}>Create</Button></div>:null}
      <h5>Opened Tickets({accordionData.length})</h5>
      <div className="issue_accordion">
        {openTickets?.map(({ title, desc,status },index) => (
          <Accordion title={title} content={desc} index={index} status={status} />
        ))
        }
      </div>

      <h5>Closed Tickets({accordionData.length})</h5>
      <div className="issue_accordion">
        {closedTickets?.map(({ title, desc,status },index) => (
          <Accordion title={title} content={desc} status={status} index={index} />
        ))
        }
      </div>
    </div>
    <Modal
          show={show}
          heading="Create Ticket"
          onClose={() => {
            setShow(false);
          }}
          size="lg"
        >
          <Form
            onSubmit={submitHandler}
            validated={validated}
          >
            <Form.Group className="mb-3 " controlId="deactivate_carrier">
            <Form.Label className="">
                Title
              </Form.Label>
              <Form.Control
                // className="subject_text"
                placeholder="Title"
                type="text"
                name="title"
                required
                minLength={10}
                maxLength={60}
              />
              <Form.Control.Feedback type="invalid">
              Title must be at least 10 characters long!
                      </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="content">
              <Form.Label className="">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Description..."
                // className="content_text"
                type="text"
                name="desc"
                required
                minLength={30}
                maxLength={500}
                rows={8}
              />
<Form.Control.Feedback type="invalid">
Description must be at least 30 characters long!
                      </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 upload_file_group" controlId="deactivate_carrier">
              <div {...getRootProps({ className: "dropzone" })}>
                <input
                  className="input-zone"
                  {...getInputProps()}
                  type="file"
                  name="file"
                // onChange={drop}
                />
                <div className="text-center upload_drap_wrapper">


                  <button type="button" className="butn">
                    UPLOAD
                  </button>
                  {isDragActive ? (
                    <span className="drap_text">
                      Release to drop the files here
                    </span>
                  ) : (<>
                    <span className="drap_text"> OR drag and drop file here</span>
                  </>
                  )}


                </div>
                <aside>
                  <ul>{files}</ul>
                </aside>
              </div>
            </Form.Group>
            <div className="btn_feedback">
              <Button type="submit" disabled={loader}>
                {loader ? (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )
                  : null}
                Create</Button>
            </div>
          </Form>
        </Modal>
    </>
    )
}
export default CarrierIssues;